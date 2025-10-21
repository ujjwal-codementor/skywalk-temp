import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { calculateCancellationFee } from '@/lib/cancellationFeeCalculator';
import { db } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { subscriptionId } = req.query;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId },
      include: {
        subscriptions: {
          where: {
            stripeSubscriptionId: subscriptionId as string
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const subscription = user.subscriptions[0];
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Calculate cancellation fee using the library function
    const feeResult = calculateCancellationFee(
      subscription.subscriptionType,
      subscription.serviceEndTime.toISOString(),
      subscription.buyDate.toISOString()
    );

    return res.status(200).json({
      subscriptionId,
      subscriptionType: subscription.subscriptionType,
      subscriptionStartDate: subscription.buyDate,
      serviceEndTime: subscription.serviceEndTime,
      shouldApplyFee: feeResult.shouldApplyFee,
      cancellationFee: feeResult.feeAmount,
      cancellationFeeFormatted: feeResult.feeAmountFormatted,
      monthsCharged: feeResult.monthsCharged,
      reason: feeResult.reason
    });

  } catch (error) {
    console.error('Error calculating cancellation fee:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
