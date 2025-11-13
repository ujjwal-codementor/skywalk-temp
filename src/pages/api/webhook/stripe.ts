import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { db } from '@/lib/db';
import calculateServiceTime from '@/lib/serviceTimeCal';
import { subscriptionPurchaseEmail } from '@/lib/emailTemplates';
import { sendPromotionalEmail } from '@/lib/emailses';
export const config = {
  api: {
    bodyParser: false,
  },
};

const sendFromEmail = process.env.NOTIFICATIONS_FROM_EMAIL || "info@furnishcare.com";

async function handleInvoicePaymentSucceeded(invoice: any) {
  try {

    let subscriptionId = invoice.lines?.data[0]?.parent?.subscription_item_details?.subscription;
    let isCancelInvoice = false;
    console.log('1')
    if (!subscriptionId) {
        subscriptionId = invoice.parent.subscription_details.subscription;
        isCancelInvoice = true;
        if(!subscriptionId){
          console.log("error subscripionId not found in invoice");
          return;
        }
    }


    const existingSub = await db.subscription.findUnique({
      where: {
        stripeSubscriptionId: subscriptionId
      }
    })
  

    if (!existingSub) {
      return;
    }

    const invoiceId: string = invoice.id;
    const invoiceLink: string = invoice.hosted_invoice_url;

    console.log('invoiceId', invoiceId);
    console.log('invoiceLink', invoiceLink);

    await db.payment.create({
      data: {
        invoiceId,
        invoiceLink,
        subscriptionId: existingSub.id,
        userId : existingSub.userId,
      }
    })

    console.log(`Subscription ${subscriptionId} payment succeeded for userId ${existingSub.userId}`);
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    const stripeSubscriptionId = subscription.id;

    // Update subscription status in database
    const sub = await db.subscription.update({
      where: {
        stripeSubscriptionId
      },
      data: {
        status: 'expired',
        serviceEndTime: new Date().toISOString()
      }
    });

    const userId = sub.userId;

    const user = await db.user.findUnique({
      where:{
        id: userId
      },
      select:{
        clerkId: true
      }
    })

    const clerkId = user!.clerkId

    await db.progress.delete({
      where:{
        clerkId
      }
    })


    console.log(`Subscription ${subscription.id} cancelled for user`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  try {
    
    const subscriptionId = session.subscription;

    const now = Date.now();

    // Add 12 months (approx 12 * 30 days)
    const twelveMonthsInSeconds = 3600 * 24 * 365;

    // cancel_at must be in **seconds**
    const cancelAt = Math.floor(now / 1000) + twelveMonthsInSeconds;

    if(subscriptionId){
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at: cancelAt
    });
    }

    const userId = session.metadata.userId;
    const clerkId = session.metadata.clerkId;
    const planId = session.metadata.planId;
    const cutomerId = session.customer;
    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];




    const existingSub = await db.subscription.findUnique({
      where: {
        stripeSubscriptionId: subscriptionId
      }
    })
    let sub;

    if (!existingSub) {
      const { serviceStartTime, serviceEndTime } = calculateServiceTime(new Date());

      sub = await db.subscription.create({
        data: {
          stripeSubscriptionId: subscriptionId,
          userId,
          subscriptionType: planId,
          status: 'active',
          stripeCustomerId: cutomerId,
          buyDate: new Date(),
          serviceStartTime: serviceStartTime.toISOString(),
          serviceEndTime: serviceEndTime.toISOString(),
          servicesLeft: plan.frequency
        }
      })
    }
    else {
      sub = existingSub;
    }

    // console.log('3')

    const invoiceId: string = session.invoice;
    const invoice = await stripe.invoices.retrieve(invoiceId);
    const invoiceLink = invoice.hosted_invoice_url;



    // console.log('invoiceId', invoiceId);
    // console.log('invoiceLink', invoiceLink);

    await db.payment.create({
      data: {
        invoiceId,
        invoiceLink,
        subscriptionId: sub.id,
        userId,
      }
    })


    await db.progress.update({
      where:{
        clerkId
      },
      data:{
        currentStep: 3
      }
    })

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })

    const email = subscriptionPurchaseEmail({
      fullName: user!.fullName,
      planName: `${sub.subscriptionType} plan`,
      price: plan.price.toString(),
      serviceStartTime: sub.serviceStartTime,
      serviceEndTime: sub.serviceEndTime,
    })

    await sendPromotionalEmail(user!.email, sendFromEmail, email.subject, email.html);

    console.log('🔄 Checkout session completed:', session.id);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handleCustomerSubscriptionUpdated(subscription: any) {
  try {
    console.log('🔄 Subscription updated webhook received:', subscription.id);

    const statusMap: Record<string, string> = {
      trialing: 'trialing',
      active: 'active',
      past_due: 'past_due',
      canceled: 'cancelled',
      unpaid: 'unpaid',
      incomplete: 'failed',
      incomplete_expired: 'failed',
      paused: 'paused',
    };

    const mappedStatus = statusMap[subscription.status];

    if (!mappedStatus) {
      console.warn(`⚠️ Unknown Stripe subscription status: ${subscription.status}`);
      return;
    }

    // await db.subscription.update({
    //   where: {
    //     stripeSubscriptionId: subscription.id,
    //   },
    //   data: {
    //     status: mappedStatus,
    //   },
    // });

    console.log(`✅ Subscription ${subscription.id} updated to status: ${mappedStatus}`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    }

    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'invoice.payment_succeeded':
        console.log('Invoice payment succeeded');
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleCustomerSubscriptionUpdated(event.data.object);
        break;

      case 'checkout.session.completed':
        // Handle successful checkout completion
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        await handleCheckoutSessionCompleted(session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

