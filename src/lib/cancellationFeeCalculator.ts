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
  const startDate = new Date(buyDate);
  
  // Calculate months left in subscription
  const monthsLeft = Math.ceil(
    (endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  );
  
  // If subscription has ended or is about to end, no fee
  if (monthsLeft <= 0) {
    return {
      shouldApplyFee: false,
      feeAmount: 0,
      feeAmountFormatted: '$0.00',
      monthsCharged: 0,
      reason: 'Subscription has ended or is about to end - no cancellation fee'
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
  
  // Calculate fee based on months left
  let monthsCharged: number;
  
  if (monthsLeft >= 3) {
    // If 3 or more months left, charge for 3 months
    monthsCharged = 3;
  } else {
    // If less than 3 months, charge for remaining months (round up for partial months)
    monthsCharged = Math.ceil(monthsLeft);
  }
  
  // Calculate fee amount (plan price * months charged)
  const feeAmount = plan.price * monthsCharged;
  
  return {
    shouldApplyFee: true,
    feeAmount: feeAmount / 100, // Convert cents to dollars
    feeAmountFormatted: `$${(feeAmount / 100).toFixed(2)}`,
    monthsCharged,
    reason: `Cancellation fee is ${monthsCharged} month's cost (${monthsLeft.toFixed(1)} months remaining)`
  };
}
