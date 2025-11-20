import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Layout from '@/components/layout/Layout';
import Modal from '@/components/ui/Modal';
import DashboardSkeleton from '@/components/ui/DashboardSkeleton';
import { useGetApi } from '@/lib/apiCallerClient';
import { format } from 'date-fns';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;


interface DashboardData {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    clerkId: string;
    subscriptions: Array<{
      id: string;
      subscriptionType: string;
      status: string;
      buyDate: string;
      serviceStartTime: string;
      serviceEndTime: string;
      S3key: string;
      servicesLeft: number;
      stripeSubscriptionId: string;
      createdAt: string;
      updatedAt: string;
      payments: Array<{
        id: string;
        invoiceId: string;
        invoiceLink: string | null;
        createdAt: string;
      }>;
    }>;
    bookings?: Array<{
      id: string;
      calcomId: string;
      completed: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    payments: Array<{
      id: string;
      invoiceId: string;
      invoiceLink: string | null;
      createdAt: string;
      isCancelPayment : Boolean
      subscription: {
        id: string;
        subscriptionType: string;
      };
    }>;
  } | null;
  canBookService: boolean;
  payments: Array<{
    id: string;
    invoiceId: string;
    invoiceLink: string | null;
    createdAt: string;
    isCancelPayment : Boolean
    subscription: {
      id: string;
      subscriptionType: string;
    };
  }>;
}

export default function Dashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    description: '',
    serviceType: 'subscription_touch_up' as const
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const getApi = useGetApi();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect=/dashboard');
      return;
    }

    if (isSignedIn) {
      fetchDashboardData();
    }

    // Check for success messages from URL params
    if (router.query.cancelled === 'true') {
      setShowSuccessMessage(true);
      // Clean up URL
      router.replace('/dashboard', undefined, { shallow: true });
    }
  }, [isSignedIn, isLoaded, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getApi(`${BACKEND_URL}/api/user/dash`);
      setDashboardData(response.data);
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        // Unauthorized - redirect to sign in
        router.push('/sign-in?redirect=/dashboard');
      } else if (error.response?.status === 404) {
        // User not found - show profile completion message
        setDashboardData({ user: null, canBookService: false, payments: [] });
      } else {
        // Other errors - show retry option
        setDashboardData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleServiceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`🎉 Service Request Submitted!\n\nType: ${serviceForm.serviceType.replace('_', ' ')}\nDescription: ${serviceForm.description}\n\nOur team will contact you within 24 hours to schedule your appointment.`);
    
    setShowServiceModal(false);
    setServiceForm({ description: '', serviceType: 'subscription_touch_up' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'grace_period': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isLoaded || loading) {
    return (
      <Layout title="Dashboard - Furnish Care">
        <DashboardSkeleton />
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout title="Dashboard - Furnish Care">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Failed to load dashboard data</p>
            <button 
              onClick={fetchDashboardData}
              className="btn-primary mt-4"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Check if user data exists
  if (!dashboardData.user) {
    return (
      <Layout title="Dashboard - Furnish Care">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Profile Not Found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find your user profile. Please complete your profile setup first.
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="btn-primary"
            >
              Complete Profile
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { user: userProfile, canBookService } = dashboardData;
  const activeSubscriptions = userProfile?.subscriptions?.filter(sub => sub.status === 'active') || [];
  const pastSubscriptions = userProfile?.subscriptions?.filter(sub => sub.status !== 'active') || [];
  const activeBooking = userProfile?.bookings?.find((b) => !b.completed);
  const pastBookingsCount = (userProfile?.bookings || []).filter((b) => b.completed).length;

  return (
    <Layout title="Dashboard - Furnish Care">
      <div className="min-h-screen bg-gray-50 py-8">
                  <div className="container-width section-padding">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-green-700">
                  <p className="font-medium">Subscription Cancelled Successfully</p>
                  <p>Your subscription has been cancelled and any applicable fees have been processed.</p>
                </div>
                <button 
                  onClick={() => setShowSuccessMessage(false)}
                  className="ml-auto text-green-400 hover:text-green-600"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userProfile.fullName}
            </h1>
            <p className="text-gray-600">
              Manage your furnish care subscription and schedule services
            </p>
            {isSignedIn && (
              <p className="text-sm text-gray-500 mt-1">
                User Email: {userProfile.email}
              </p>
            )}
          </div>

          {/* Subscription Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Subscription Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Subscriptions:</span>
                  <span className="font-medium text-gray-900">
                    {activeSubscriptions.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Subscriptions:</span>
                  <span className="font-medium text-gray-900">
                    {userProfile?.subscriptions?.length || 0}
                  </span>
                </div>
                {/* <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-sm text-gray-900">{userProfile.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-sm text-gray-900">{userProfile.phone}</span>
                </div> */}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Eligibility</h3>
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  canBookService ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {canBookService ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <p className={`font-medium mb-2 ${
                  canBookService ? 'text-green-600' : 'text-red-600'
                }`}>
                  {canBookService ? 'Eligible for Service' : 'Not Eligible for Service'}
                </p>
                <button
                  onClick={() => router.push('/book-appointment')}
                  disabled={!canBookService}
                  className={`w-full ${
                    canBookService 
                      ? 'btn-primary' 
                      : 'btn-secondary opacity-50 cursor-not-allowed'
                  }`}
                >
                  Request Service
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bookings</h3>
              {activeBooking ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Booking ID:</span>
                    <span className="text-gray-900 text-right max-w-[150px] truncate" title={activeBooking.id}>
                      {activeBooking.id.substring(0, 10)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900">{format(new Date(activeBooking.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-700 font-medium">Active</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Past bookings:</span>
                    <span className="text-gray-900 font-medium">{pastBookingsCount}</span>
                  </div>
                  <p className="text-gray-500 mt-2">You don’t have an active booking right now.</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Subscriptions */}
          {activeSubscriptions.length > 0 && (
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Active Subscriptions</h3>
                <span className="text-sm text-gray-500">
                  {activeSubscriptions.length} active
                </span>
              </div>

              <div className="space-y-4">
                {activeSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="border border-green-200 rounded-xl p-4 bg-green-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {subscription.subscriptionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Started on {format(new Date(subscription.buyDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                        {subscription.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Service Period:</span>
                        <p className="text-gray-900">
                          {format(new Date(subscription.serviceStartTime), 'MMM dd, yyyy')} - {format(new Date(subscription.serviceEndTime), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Services Left:</span>
                        <p className="text-gray-900 font-semibold">
                          {subscription.servicesLeft} remaining
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        Created: {format(new Date(subscription.createdAt), 'MMM dd, yyyy')}
                      </div>
                      <button
                        onClick={() => router.push(`/cancel-subscription?subscriptionId=${subscription.stripeSubscriptionId}`)}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Subscriptions */}
          {pastSubscriptions.length > 0 && (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Past Subscriptions</h3>
                <span className="text-sm text-gray-500">
                  {pastSubscriptions.length} total
                </span>
              </div>

              <div className="space-y-4">
                {pastSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {subscription.subscriptionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Started on {format(new Date(subscription.buyDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                        {subscription.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Service Period:</span>
                        <p className="text-gray-900">
                          {format(new Date(subscription.serviceStartTime), 'MMM dd, yyyy')} - {format(new Date(subscription.serviceEndTime), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <p className="text-gray-900">
                          {format(new Date(subscription.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment History */}
          {dashboardData.payments && dashboardData.payments.length > 0 && (
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Payment History</h3>
                <span className="text-sm text-gray-500">
                  {dashboardData.payments.length} payments
                </span>
              </div>

              <div className="space-y-4">
                {dashboardData.payments.map((payment) => (
                  <div key={payment.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {payment.subscription.subscriptionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} {payment.isCancelPayment == true? 'plan cancellation fee' : 'plan installment'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Invoice ID: {payment.invoiceId}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          PAID
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    {payment.invoiceLink && (
                      <div className="flex justify-end">
                        <a
                          href={payment.invoiceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Invoice
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Subscriptions Message */}
          {userProfile.subscriptions.length === 0 && (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Subscriptions Found</h3>
              <p className="text-gray-600 mb-4">
                You don't have any subscriptions yet. Start by choosing a plan.
              </p>
              <button
                onClick={() => router.push('/pricing')}
                className="btn-primary"
              >
                View Plans
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Service Request Modal */}
      <Modal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        title="Request Service"
        size="md"
      >
        <form onSubmit={handleServiceRequest} className="space-y-4">
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              id="serviceType"
              value={serviceForm.serviceType}
              onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value as any })}
              className="input-field"
            >
              <option value="subscription_touch_up">Subscription Touch-up</option>
              <option value="deep_polish">Deep Polish</option>
              <option value="refinishing">Refinishing</option>
              <option value="upholstery_cleaning">Upholstery Cleaning</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              className="input-field"
              placeholder="Describe the furniture damage or service needed..."
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-medium">Service Request</p>
                <p>Submit your service request and our team will contact you within 24 hours</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowServiceModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Request Service
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}



