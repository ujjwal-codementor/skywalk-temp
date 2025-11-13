import { useState } from 'react';
import { usePostApi } from '@/lib/apiCallerClient';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

interface CancelSubscriptionButtonProps {
  subscriptionId: string;
  planName: string;
  onCancelled?: () => void;
}

export default function CancelSubscriptionButton({ 
  subscriptionId, 
  planName, 
  onCancelled 
}: CancelSubscriptionButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const postApi = usePostApi();

  const handleCancelClick = () => {
    setShowModal(true);
    setError(null);
  };

  const handleConfirmCancel = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await postApi(`${BACKEND_URL}/api/stripe/cancel-subscription`, {
        subscriptionId
      });

      if (response.status === 200) {
        setShowModal(false);
        onCancelled?.();
        // You could show a success message here
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      setError(error.response?.data?.error || 'Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!loading) {
      setShowModal(false);
      setError(null);
    }
  };

  return (
    <>
      <button
        onClick={handleCancelClick}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Cancel Subscription
      </button>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Cancel Subscription"
        size="md"
      >
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Cancel {planName} Plan?
            </h3>
            
            <p className="text-gray-600 text-center mb-4">
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-medium text-yellow-800">Cancellation Fee</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  A cancellation fee may apply based on your remaining subscription time. The exact amount will be calculated and charged immediately.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleCloseModal}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Keep Subscription
            </button>
            
            <button
              onClick={handleConfirmCancel}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </div>
              ) : (
                'Cancel & Pay Fee'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
