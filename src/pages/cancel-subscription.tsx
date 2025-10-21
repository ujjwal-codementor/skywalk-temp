import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Layout from '@/components/layout/Layout';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useGetApi, usePostApi } from '@/lib/apiCallerClient';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

interface CancellationFeeData {
  subscriptionId: string;
  subscriptionType: string;
  subscriptionStartDate: string;
  serviceEndTime: string;
  shouldApplyFee: boolean;
  cancellationFee: number;
  cancellationFeeFormatted: string;
  monthsCharged: number;
  reason: string;
}

export default function CancelSubscription() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { subscriptionId } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [feeData, setFeeData] = useState<CancellationFeeData | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApi = useGetApi();
  const postApi = usePostApi();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect=/dashboard');
      return;
    }

    if (isSignedIn && subscriptionId) {
      fetchCancellationFee();
    }
  }, [isSignedIn, isLoaded, subscriptionId, router]);

  const fetchCancellationFee = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getApi(`${BACKEND_URL}/api/stripe/get-cancellation-fee?subscriptionId=${subscriptionId}`);
      setFeeData(response.data);
    } catch (error: any) {
      console.error('Failed to fetch cancellation fee:', error);
      setError(error.response?.data?.error || 'Failed to load cancellation information');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelling(true);
      setError(null);
      
      const response = await postApi(`${BACKEND_URL}/api/stripe/cancel-subscription`, {
        subscriptionId: feeData?.subscriptionId
      });

      if (response.status === 200) {
        // Success - redirect to dashboard with success message
        router.push('/dashboard?cancelled=true');
      }
    } catch (error: any) {
      console.error('Failed to cancel subscription:', error);
      setError('Failed to cancel subscription');
    } finally {
      setCancelling(false);
      setShowConfirmModal(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <Layout title="Cancel Subscription - Furnish Care">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!subscriptionId) {
    return (
      <Layout title="Cancel Subscription - Furnish Care">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No subscription ID provided</p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !feeData) {
    return (
      <Layout title="Cancel Subscription - Furnish Care">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Cancel Subscription - Furnish Care">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cancel Subscription</h1>
            <p className="text-gray-600">
              We're sorry to see you go. Please review the cancellation details below.
            </p>
          </div>

          {feeData && (
            <div className="space-y-6">
              {/* Subscription Details */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subscription Type:</span>
                    <span className="font-medium text-gray-900">
                      {feeData.subscriptionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(feeData.subscriptionStartDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(feeData.serviceEndTime).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Months Charged:</span>
                    <span className="font-medium text-gray-900">{feeData.monthsCharged} month{feeData.monthsCharged !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Fee */}
              <div className={`card ${feeData.shouldApplyFee ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Fee</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fee Amount:</span>
                    <span className={`text-2xl font-bold ${feeData.shouldApplyFee ? 'text-yellow-600' : 'text-green-600'}`}>
                      {feeData.cancellationFeeFormatted}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Reason:</strong> {feeData.reason}
                  </div>
                  {feeData.shouldApplyFee && (
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-4">
                      <div className="flex">
                        <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-yellow-700">
                          <p className="font-medium">Cancellation Fee</p>
                          <p>A cancellation fee of {feeData.cancellationFeeFormatted} applied. This fee will be charged immediately upon cancellation.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-red-700">
                      <p className="font-medium">Error</p>
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 btn-secondary"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={cancelling}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => !cancelling && setShowConfirmModal(false)}
        title="Confirm Cancellation"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure you want to cancel?
            </h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. Your subscription will be cancelled immediately.
            </p>
            {feeData?.shouldApplyFee && (
              <p className="text-red-600 font-medium">
                You will be charged {feeData.cancellationFeeFormatted} as a cancellation fee worth {feeData.monthsCharged} month's cost of plan.
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              disabled={cancelling}
              className="flex-1 btn-secondary"
            >
              Keep Subscription
            </button>
            <button
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {cancelling ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Cancelling...</span>
                </>
              ) : (
                'Yes, Cancel Now'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
