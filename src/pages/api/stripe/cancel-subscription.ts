import type {NextApiRequest, NextApiResponse} from 'next';
import {getAuth} from '@clerk/nextjs/server';
import {stripe} from '@/lib/stripe';
import {db} from '@/lib/db';
import {calculateCancellationFee} from '@/lib/cancellationFeeCalculator';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  try {
    const {userId: clerkId} = getAuth(req);
    if(!clerkId) {
      return res.status(401).json({error: 'Unauthorized'});
    }

    const {subscriptionId} = req.body;

    if(!subscriptionId) {
      return res.status(400).json({error: 'Subscription ID is required'});
    }

    // Get user from database
    const userWithSub = await db.user.findFirst({
      where: {
        clerkId,
        subscriptions: {
          some: {
            stripeSubscriptionId: subscriptionId,
          },
        },
      },
      include: {
        subscriptions: true, // optional, only if you want subscription details
      },
    });

    if(!userWithSub) {
      return res.status(404).json({error: 'User not found'});
    }

    // Get subscription details from database
    const subscription = await db.subscription.findUnique({
      where: {
        stripeSubscriptionId: subscriptionId
      }
    });

    console.log('1')

    if(!subscription) {
      return res.status(404).json({error: 'Subscription not found'});
    }

    // Calculate the cancellation fee using the new library
    const feeResult = calculateCancellationFee(
      subscription.subscriptionType,
      subscription.serviceEndTime.toISOString(),
      subscription.buyDate.toISOString()
    );

    const customerId = subscription.stripeCustomerId;

    // Only charge fee if there should be one
    if(feeResult.shouldApplyFee && feeResult.feeAmount > 0) {
      // Create invoice item for cancellation fee (amount in cents)

      await stripe.invoiceItems.create({
        customer: customerId,
        amount: feeResult.feeAmount * 100,
        currency: 'usd',
        description: 'Early cancellation fee',
        subscription: subscriptionId, // 🔑 attaches fee to final invoice
      });


      await stripe.subscriptions.cancel(subscriptionId, {
        invoice_now: true,
        prorate: false,
      });


      // const session = await stripe.checkout.sessions.create({
      //   customer: customerId, // optional, can also let Checkout create a new customer
      //   line_items: [
      //     {
      //       price_data: {
      //         currency: "usd",
      //         product_data: {
      //           name: "Cancellation Fee", // or whatever you’re selling
      //         },
      //         unit_amount: feeResult.feeAmount * 100, // amount in cents → $20.00
      //       },
      //       quantity: 1,
      //     },
      //   ],
      //   mode: "payment", // 🔑 one-time payment
      //   payment_method_types: ["card", "link"],
      //   success_url: `https://georgia-exact-cyber-uri.trycloudflare.com/dashboard`,
      //   cancel_url: `https://georgia-exact-cyber-uri.trycloudflare.com/dashboard`,
      //   metadata:{
      //     subscriptionId, 
      //   }
      // });


    }


    return res.status(200).json({
      message: 'Subscription cancelled successfully',
      cancellationFee: feeResult.feeAmount,
      cancellationFeeFormatted: feeResult.feeAmountFormatted,
      monthsCharged: feeResult.monthsCharged,
      reason: feeResult.reason,
    });

  } catch(error) {
    console.error('Error cancelling subscription:', error);
    return res.status(500).json({error: 'Internal server error'});
  }
}

