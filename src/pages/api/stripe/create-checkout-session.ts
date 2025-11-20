// import type { NextApiRequest, NextApiResponse } from 'next';
// import { getAuth } from '@clerk/nextjs/server';
// import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe';
// import { db } from '@/lib/db';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const { userId: clerkId } = getAuth(req);
//     if (!clerkId) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const { planId, successUrl, cancelUrl } = req.body;

//     if (!planId || !successUrl || !cancelUrl) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
//     if (!plan) {
//       return res.status(400).json({ error: 'Invalid plan' });
//     }

//     // Get user from database
//     const user = await db.user.findUnique({
//       where: { clerkId }
//     });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Create or get Stripe customer
//     let customer;
//     const existingCustomers = await stripe.customers.list({
//       email: user.email,
//       limit: 1
//     });

//     if (existingCustomers.data.length > 0) {
//       customer = existingCustomers.data[0];
//     } else {
//       customer = await stripe.customers.create({
//         email: user.email,
//         name: user.fullName,
//         phone: user.phone,
//         metadata: {
//           clerkId,
//           userId: user.id
//         }
//       });
//     }

//     // Create subscription schedule with 12 iterations
//     const subscriptionSchedule = await stripe.subscriptionSchedules.create({
//       customer: customer.id,
//       start_date: 'now',
//       end_behavior: 'cancel',
//       phases: [
//         {
//           items: [
//             {
//               price: plan.stripePriceId,
//               quantity: 1,
//             },
//           ],
//           iterations: 12, // Exactly 12 billing cycles
//           collection_method: 'charge_automatically',
//         //   default_payment_method_types: ['card'],
//         },
//       ],
//       metadata: {
//         planId,
//         clerkId,
//         userId: user.id
//       }
//     });

//     // Create Checkout session
// const session = await stripe.checkout.sessions.create({
//   customer: customer.id,
//   // payment_method_types: ['card'],
//   line_items: [
//     {
//       price: plan.stripePriceId,
//       quantity: 1,
//     },
//   ],
//   mode: 'subscription',
//   subscription_data: {
//     metadata: {
//       planId,
//       clerkId,
//       userId: user.id
//     }
//   },
//   success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
//   cancel_url: cancelUrl,
//   metadata: {
//     planId,
//     clerkId,
//     userId: user.id,
//     subscriptionScheduleId: subscriptionSchedule.id
//   }
// });



//     return res.status(200).json({ 
//       sessionId: session.id,
//       url: session.url,
//       subscriptionScheduleId: subscriptionSchedule.id
//     });

//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }



import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { db } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const { planId, successUrl, cancelUrl } = req.body;
    if (!planId || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });

    // Fetch user
    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Ensure Stripe customer
    let customer;
    const existing = await stripe.customers.list({ email: user.email, limit: 1 });
    customer = existing.data.length > 0
      ? existing.data[0]
      : await stripe.customers.create({
        email: user.email,
        name: user.fullName,
        phone: user.phone,
        metadata: { clerkId, userId: user.id }
      });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: plan.stripePriceId, // must be a monthly recurring price
          quantity: 1,
        },
      ],
      mode: 'subscription',
      payment_method_types: ['card', 'link'],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      subscription_data:{
        metadata:{
          planId, clerkId, userId: user.id
        }
      },
      metadata: { planId, clerkId, userId: user.id },
    });


    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


