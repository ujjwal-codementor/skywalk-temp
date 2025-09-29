import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SUBSCRIPTION_PLANS, formatStripeAmount } from '@/lib/stripe-client';
import { usePostApi } from '@/lib/apiCallerClient';



const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;



export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const user = true;
  const router = useRouter();
  const postApi = usePostApi();

  const handlePlanSelection = async (planId: string) => {


    // Demo: Simulate subscription process

    try {
      setLoadingPlan(planId);
      console.log(planId)
      const res = await postApi(`${BACKEND_URL}/api/progress/set`, {
        subscriptionType: planId
      })

      if (res.status == 200) {
        setLoadingPlan(null);
        router.push('/user/progress');
      }
    }
    catch {
      setLoadingPlan(null);
      router.push('/sign-in');
    }
  };

  return (
    <Layout
      title="Pricing - Furnish Care"
      description="Choose the perfect furniture care plan for your needs. All plans include our 90-day grace period protection."
    >


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="container-width section-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Affordable protection, premium care—because your furniture deserves it.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-white">
        <div className="container-width section-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-10xl mx-auto">
            {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
              <div
                key={plan.id}
                className={`card relative flex flex-col justify-between ${plan.id === 'standard'
                    ? 'ring-2 ring-primary-500 shadow-xl'
                    : 'hover:shadow-xl transition-shadow'
                  }`}
              >
                <div>
                {plan.id === 'standard' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{formatStripeAmount(plan.price)}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {plan.name === "Basic"
                      ? "1 Scheduled service visit per year."
                      : plan.name === "Standard"
                        ? "Upto 2 Scheduled service visits per year."
                        : plan.name === "Premium"
                          ? "Upto 2 Scheduled service visits per year."
                          : plan.name === "Enterprise"
                            ? "Upto 2 Scheduled service visits per year."
                            : ""}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                </div>
                <button
                  onClick={() => handlePlanSelection(plan.id)}
                  disabled={loadingPlan === plan.id}
                  className={`block w-full text-center py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 ${plan.id === 'standard'
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                >
                  {loadingPlan === plan.id ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </div>
                  ) : (
                    user ? 'Subscribe Now' : 'Get Started'

                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grace Period Explanation */}
      <section className="py-16 bg-gray-50">
        <div className="container-width section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                90-Day Quality Care Kickstart
              </h2>
              <p className="text-xl text-gray-600">
                Every subscription includes comprehensive Furnish Care from day one
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">What's Included In Each Plan</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Accidental damage repairs</li>
                  <li>• Pet-related furniture touch-ups and repairs</li>
                  <li>• Child-related wear and tear touch-ups</li>
                  <li>• Normal usage deterioration repairs</li>
                  <li>• Stains and discoloration touch-ups</li>
                </ul>
              </div>

              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">How It Works</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Your plan activates the moment you subscribe</li>
                  <li>• Schedule your first service at your convenience</li>
                  <li>• Expert technicians provide professional repairs and touch-ups</li>
                  <li>• Each visit includes a full furniture assessment</li>
                  <li>• Enjoy ongoing care that keeps your furniture looking new</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-primary-50 rounded-xl border border-primary-200">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-primary-900 mb-2">
                  Professional Guarantee
                </h4>
                <p className="text-primary-700">
                  Our certified technicians use premium products and proven techniques.
                  If you're not completely satisfied with our service, we'll make it right or provide a full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-on Services */}
      {/* <section className="py-16 bg-white">
        <div className="container-width section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Add-on Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Need something extra? We offer specialized services for unique furniture care needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {addOnServices.map((service, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <span className="text-primary-600 font-medium">{service.price}</span>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button 
                  onClick={() => alert('Demo: Add-on service booking would be available here!')}
                  className="btn-outline w-full"
                >
                  Schedule Service
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Premium subscribers receive 10% off all add-on services
            </p>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="container-width section-padding">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Protecting Your Furniture Today
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust their furniture care to our professionals.
            </p>
            {!user ? (
              <Link
                href="/auth/signup"
                className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Get Started Now
              </Link>
            ) : (
              <button
                onClick={() => handlePlanSelection('standard')}
                className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Choose Standard Plan
              </button>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}