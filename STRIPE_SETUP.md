# Stripe Subscription Setup Guide

This guide will help you set up Stripe subscriptions for your Next.js application.

## Prerequisites

1. A Stripe account (create one at [stripe.com](https://stripe.com))
2. Node.js and npm installed
3. Your Next.js application running

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Your Stripe webhook secret

# Stripe Price IDs for each plan (Server-side)
STRIPE_BASIC_PRICE_ID=price_... # Basic plan price ID
STRIPE_STANDARD_PRICE_ID=price_... # Standard plan price ID
STRIPE_PREMIUM_PRICE_ID=price_... # Premium plan price ID
STRIPE_ENTERPRISE_PRICE_ID=price_... # Enterprise plan price ID

# Stripe Price IDs for each plan (Client-side - optional, for display purposes)
NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID=price_... # Basic plan price ID
NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID=price_... # Standard plan price ID
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_... # Premium plan price ID
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=price_... # Enterprise plan price ID

# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Stripe Dashboard Setup

### 1. Create Products and Prices

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add Product**
3. Create products for each subscription plan:
   - Basic Plan ($19/month)
   - Standard Plan ($29/month)
   - Premium Plan ($49/month)
   - Enterprise Plan ($149/month)

4. For each product, create a recurring price:
   - Billing model: **Standard pricing**
   - Price: Set the monthly amount
   - Billing period: **Monthly**
   - Billing behavior: **Charge automatically**

5. Copy the Price IDs and add them to your environment variables.

### 2. Set Up Webhooks

1. In your Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhooks`
4. Select the following events:
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
   - `checkout.session.completed`
5. Copy the webhook signing secret and add it to `STRIPE_WEBHOOK_SECRET`

## Features Implemented

### 1. Subscription Creation
- Uses Stripe Subscription Schedules with exactly 12 iterations
- Automatically cancels after 12 billing cycles
- Creates Stripe customers automatically
- Integrates with your existing progress flow

### 2. Cancellation with Fees
- $20 cancellation fee charged immediately
- Creates invoice items for the fee
- Cancels subscription immediately after fee payment
- Updates database and progress status

### 3. Buy Now Page
- Step 3 in your progress flow
- Redirects to Stripe Checkout
- Handles success/cancel scenarios
- Updates progress automatically

### 4. Webhook Handling
- Processes payment success events
- Updates subscription status
- Manages subscription lifecycle
- Updates user progress

## API Endpoints

### Create Checkout Session
```
POST /api/stripe/create-checkout-session
Body: { planId, successUrl, cancelUrl }
```

### Cancel Subscription
```
POST /api/stripe/cancel-subscription
Body: { subscriptionId }
```

### Webhook Handler
```
POST /api/stripe/webhooks
```

## Frontend Components

### CancelSubscriptionButton
- Shows cancel button with confirmation modal
- Displays cancellation fee information
- Handles the cancellation process

### Buy Now Page
- Displays plan details and pricing
- Integrates with Stripe Checkout
- Shows loading states and error handling

## Testing

### Test Cards
Use these test card numbers in Stripe test mode:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

### Test Mode
- All Stripe operations run in test mode by default
- No real charges will be made
- Use test webhook endpoints for development

## Production Deployment

1. Switch to live Stripe keys
2. Update webhook endpoints to production URLs
3. Test the complete flow in production
4. Monitor webhook delivery and errors
5. Set up proper error logging and monitoring

## Troubleshooting

### Common Issues

1. **Webhook signature verification failed**
   - Check that `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure webhook endpoint is accessible

2. **Price ID not found**
   - Verify price IDs exist in your Stripe account
   - Check environment variables are loaded correctly

3. **Customer not found**
   - Ensure user has completed the signup process
   - Check that Clerk authentication is working

4. **Subscription creation fails**
   - Verify Stripe account has proper permissions
   - Check that price IDs are active and accessible

### Debug Mode
Enable debug logging by setting:
```bash
NODE_ENV=development
```

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For application-specific issues:
- Check the browser console for errors
- Review server logs for API errors
- Verify database connections and schema
