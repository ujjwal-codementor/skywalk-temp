import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';

import LoadingSpinner from '@/components/ui/LoadingSpinner';

import { usePostApi } from '@/lib/apiCallerClient';


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 19,
    frequency: 1,
    features: [
      'Annual furniture touch-up service',
      '90-day grace period protection',
      'upto 3 pieces',
      '$100 for each extra peice',
      'Damage assessment',
      'Ideal for light home usage, minimal wear'
    ],
    stripePrice: 'price_basic_annual'
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 29,
    frequency: 2,
    features: [
      'Bi-annual furniture touch-up service',
      '90-day grace period protection',
      'upto 5 pieces',
      '$100 for each extra peice',
      'Idea for moderate use households'
    ],
    stripePrice: 'price_standard_biannual'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49,
    frequency: 3,
    features: [
      'Quarterly (or 1 on-demand/year + 2 scheduled)',
      '90-day grace period protection',
      'upto 8 pieces',
      '$100 for each extra peice',
      'Ideal for High-use furniture & busy households',
    ],
    stripePrice: 'price_premium_quarterly'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149,
    frequency: 2,
    features: [
      'Bi-annual serive',
      '90-day grace period protection',
      'upto 20 peices',
      '$100 for each extra peice',
      'Ideal for Restaurants, hotels, offices and commercial spaces',
    ],
    stripePrice: 'price_premium_quarterly'
  }
];

const addOnServices = [
  {
    name: 'Deep Polish Service',
    description: 'Intensive polishing and conditioning for heavily worn furniture',
    price: 'Starting at $75'
  },
  {
    name: 'Refinishing Service',
    description: 'Complete refinishing for damaged or severely worn furniture',
    price: 'Starting at $150'
  },
  {
    name: 'Upholstery Cleaning',
    description: 'Professional cleaning for fabric furniture and cushions',
    price: 'Starting at $100'
  },
  {
    name: 'Emergency Touch-up',
    description: 'Quick response service for urgent furniture damage',
    price: 'Starting at $50'
  }
];

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const user = true;
  const router = useRouter();
  const postApi = usePostApi();

  const handlePlanSelection = async (planId: string) => {


    // Demo: Simulate subscription process
    
    try{
      setLoadingPlan(planId);
      console.log(planId)
      const res = await postApi(`${BACKEND_URL}/api/progress/set`,{
      subscriptionType: planId
    })

    if(res.status == 200){
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
      title="Pricing - Furniture Wellness"
      description="Choose the perfect furniture care plan for your needs. All plans include our 90-day grace period protection."
    >
      {/* Demo Notice */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container-width section-padding py-3">
          <div className="flex items-center justify-center text-sm text-blue-700">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Demo Mode:</span>
            <span className="ml-1">Subscription process is simulated for demonstration</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="container-width section-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              All plans include our signature 90-day grace period protection and professional furniture care.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-white">
        <div className="container-width section-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-10xl mx-auto">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`card relative ${
                  plan.id === 'standard' 
                    ? 'ring-2 ring-primary-500 shadow-xl' 
                    : 'hover:shadow-xl transition-shadow'
                }`}
              >
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
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                   {plan.frequency == 1? `Shedule a visit once a year` : `Schedule visits upto ${plan.frequency} times per year`}
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

                <button
                  onClick={() => handlePlanSelection(plan.id)}
                  disabled={loadingPlan === plan.id}
                  className={`block w-full text-center py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 ${
                    plan.id === 'standard'
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                90-Day Grace Period Protection
              </h2>
              <p className="text-xl text-gray-600">
                Every subscription includes comprehensive protection from day one
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
                  <h3 className="text-xl font-semibold text-gray-900">What's Covered</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Accidental damage protection</li>
                  <li>• Pet-related furniture damage</li>
                  <li>• Child-related wear and tear</li>
                  <li>• Normal usage deterioration</li>
                  <li>• Stains and discoloration</li>
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
                  <li>• Protection begins immediately upon subscription</li>
                  <li>• No waiting period for coverage</li>
                  <li>• Service scheduled at your convenience</li>
                  <li>• Professional assessment included</li>
                  <li>• Ongoing protection with regular maintenance</li>
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