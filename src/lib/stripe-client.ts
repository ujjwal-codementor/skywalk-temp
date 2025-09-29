// Client-side Stripe configuration (safe to import in components)
// This file only contains plan definitions and utility functions

// Subscription plan configurations
export const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 1999, // $19.00 in cents
    frequency: 1,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || 'price_basic_annual',
    features: [
      'Annual furniture touch-up service',
      'Covers up to 3 pieces of furniture',
      '$100 per additional piece',
      'Includes damage assessment',
      'Ideal for light home usage with minimal wear'
    ]
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    price: 2999, // $29.00 in cents
    frequency: 2,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID || 'price_standard_biannual',
    features: [
      'Bi-annual furniture touch-up service',
      'Covers up to 5 pieces of furniture',
      '$100 per additional piece',
      'Ideal for moderate use households'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 4999, // $49.00 in cents
    frequency: 2,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || 'price_premium_quarterly',
    features: [
      'Bi-annual furniture touch-up service',
      'Covers up to 8 pieces of furniture',
      '$100 per additional piece',
      'Ideal for High-use furniture and busy households',
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 14999, // $149.00 in cents
    frequency: 2,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || 'price_premium_quarterly',
    features: [
      'Bi-annual maintenaince included',
      'Covers up to 20 pieces of furniture',
      '$100 per additional piece',
      'Perfect for Restaurants, hotels, offices and commercial spaces',
    ]
  }
};


export function formatStripeAmount(amount: number): string {
  return `$${(amount / 100).toFixed(2)}`;
}

export function parseStripeAmount(amount: string): number {
  return Math.round(parseFloat(amount) * 100);
}

