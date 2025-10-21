import {  useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { CheckCircle, Calendar, Shield, Users } from 'lucide-react';

export default function PaymentSuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);




  return (
    <Layout 
      title="Payment Successful - Furnish Care"
      description="Your subscription has been activated successfully"
    >
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your subscription has been activated and you're now protected by our furniture care service
            </p>
            {sessionId && (
              <p className="text-sm text-gray-500 mt-2">
                Session ID: {sessionId}
              </p>
            )}
          </div>

          {/* What Happens Next */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What Happens Next?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Your First Service</h3>
                <p className="text-gray-600 text-sm">
                  Book your first furniture touch-up appointment at your convenience
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Team Ready</h3>
                <p className="text-gray-600 text-sm">
                  Our certified technicians are ready to provide professional care
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="space-y-3">
              {/* <div className="flex items-start">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Complete your profile</p>
                  <p className="text-gray-600 text-sm">Add your furniture details and preferences</p>
                </div>
              </div> */}
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Book your first service</p>
                  <p className="text-gray-600 text-sm">Schedule a convenient time for your initial assessment</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Enjoy ongoing protection</p>
                  <p className="text-gray-600 text-sm">You can renew the subscription after 12 months</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                Go to Dashboard
              </button>
            </Link>
            

          </div>

          {/* Support Info */}
          {/* <div className="text-center mt-12">
            <p className="text-gray-600 mb-2">
              Need help getting started?
            </p>
            <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact our support team
            </Link>
          </div> */}
        </div>
      </div>
    </Layout>
  );
}

