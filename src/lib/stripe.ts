import Stripe from 'stripe';

// Server-side only - this file should not be imported in client components
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
});

// Re-export client-side constants for server-side use
export { SUBSCRIPTION_PLANS, formatStripeAmount, parseStripeAmount } from './stripe-client';
