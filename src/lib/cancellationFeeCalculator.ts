import { SUBSCRIPTION_PLANS } from './stripe';

interface CancellationFeeResult {
  shouldApplyFee: boolean;
  feeAmount: number;
  feeAmountFormatted: string;
  monthsCharged: number;
  reason: string;
}

export function calculateCancellationFee(
  subscriptionType: string,
  serviceEndTime: string,
  buyDate: string
): CancellationFeeResult {
  const currentDate = new Date();
  const endDate = new Date(serviceEndTime);
  
  // If subscription has ended, no fee
  if (endDate.getTime() < currentDate.getTime()) {
    return {
      shouldApplyFee: false,
      feeAmount: 0,
      feeAmountFormatted: '$0.00',
      monthsCharged: 0,
      reason: 'Subscription has ended - no cancellation fee'
    };
  }
  
  // Get plan details
  const plan = SUBSCRIPTION_PLANS[subscriptionType as keyof typeof SUBSCRIPTION_PLANS];
  if (!plan) {
    return {
      shouldApplyFee: false,
      feeAmount: 0,
      feeAmountFormatted: '$0.00',
      monthsCharged: 0,
      reason: 'Plan not found - no cancellation fee'
    };
  }
  
  // Fixed fee: one month's price of the plan
  const feeAmount = plan.price; // plan.price is already in cents
  
  return {
    shouldApplyFee: true,
    feeAmount: feeAmount / 100, // Convert cents to dollars
    feeAmountFormatted: `$${(feeAmount / 100).toFixed(2)}`,
    monthsCharged: 1,
    reason: `Cancellation fee is one month's plan cost`
  };
}
