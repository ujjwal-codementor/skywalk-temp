import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGetApi, usePostApi } from '@/lib/apiCallerClient';
import { SUBSCRIPTION_PLANS, formatStripeAmount } from '@/lib/stripe-client';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

export default function BuyNowPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const getApi = useGetApi();
  const postApi = usePostApi();

  useEffect(() => {
    async function fetchPlanDetails() {
      try {
        const res = await getApi(`${BACKEND_URL}/api/progress/get`);
        const { subscriptionType } = res.data;

        if(res.data.currentStep != 3){
            router.push('/user/progress');
        }
        
        const planDetails = SUBSCRIPTION_PLANS[subscriptionType as keyof typeof SUBSCRIPTION_PLANS];
        if (!planDetails) {
          setError('Invalid subscription plan');
          return;
        }
        
        setPlan(planDetails);
      } catch (error) {
        console.error('Failed to fetch plan details:', error);
        setError('Failed to load plan details');
      }
    }

    fetchPlanDetails();
  }, []);

  const handleBuyNow = async () => {
    if (!plan) return;

    setLoading(true);
    setError(null);

    try {
      const successUrl = `${window.location.origin}/user/payment-success`;
      const cancelUrl = `${window.location.origin}/user/buy-now`;

      const response = await postApi(`${BACKEND_URL}/api/stripe/create-checkout-session`, {
        planId: plan.id,
        successUrl,
        cancelUrl
      });

      if (response.status === 200 && response.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <Layout 
        title="Buy Now - Furnish Care"
        description="Complete your subscription purchase"
      >
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading plan details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Buy Now - Furnish Care"
      description="Complete your subscription purchase"
    >
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Your {plan.name} Plan Purchase
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              You're just one step away from protecting your furniture with our professional care service
            </p>
          </div>

          {/* Plan Summary Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{plan.name} Plan</h2>
              <div className="text-6xl font-bold text-primary-600 mb-2">
                {formatStripeAmount(plan.price)}
              </div>
              <p className="text-gray-600 text-lg">per month</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {plan.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">What You're Getting</h3>
              <ul className="space-y-2 text-blue-800">
                {/* <li>• <strong>12-month subscription</strong> with automatic cancellation after completion</li> */}
                {/* <li>• <strong>90-day grace period protection</strong> included in every plan</li> */}
                <li>• <strong>Professional furniture care</strong> by certified technicians</li>
                <li>• <strong>Flexible scheduling</strong> based on your plan frequency</li>
                {/* <li>• <strong>Cancel anytime</strong> with a one-time $20 fee</li> */}
              </ul>
            </div>

            {/* Buy Now Button */}
            <div className="text-center">
              <button
                onClick={handleBuyNow}
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold py-4 px-12 rounded-xl text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-3" />
                    Processing...
                  </div>
                ) : (
                  `Start ${plan.name} Plan - ${formatStripeAmount(plan.price)}/month`
                )}
              </button>
              
              {error && (
                <p className="text-red-600 mt-4 text-sm">{error}</p>
              )}
            </div>
          </div>

          {/* Security & Trust */}
          <div className="bg-white rounded-xl border p-6 mb-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Trusted</h3>
              <p className="text-gray-600">
                Your payment is processed securely by Stripe. We never store your payment information.
              </p>
            </div>
          </div>

          {/* Back to Progress */}
          <div className="text-center">
            <button
              onClick={() => router.push('/user/progress')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Progress
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
