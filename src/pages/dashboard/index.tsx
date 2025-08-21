import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import { DEMO_USER_PROFILE, DEMO_SERVICE_REQUESTS, isEligibleForService } from '@/lib/demoData';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    description: '',
    serviceType: 'subscription_touch_up' as const
  });

  // Demo data
  const userProfile = DEMO_USER_PROFILE;
  const serviceRequests = DEMO_SERVICE_REQUESTS;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect=/dashboard');
      return;
    }

    // Simulate loading
    if (isSignedIn) {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [isSignedIn, isLoaded, router]);

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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isLoaded || loading) {
    return (
      <Layout title="Dashboard - Furniture Wellness">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const isEligible = isEligibleForService();
  const nextServiceDate = userProfile.nextEligibleServiceDate;
  const gracePeriodEnd = userProfile.gracePeriodEndDate;

  return (
    <Layout title="Dashboard - Furniture Wellness">
      {/* Demo Notice */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container-width section-padding py-3">
          <div className="flex items-center justify-center text-sm text-blue-700">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Demo Mode:</span>
            <span className="ml-1">All data shown is for demonstration purposes</span>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-width section-padding">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userProfile.name}
            </h1>
            <p className="text-gray-600">
              Manage your furniture care subscription and schedule services
            </p>
            {isSignedIn && (
              <p className="text-sm text-gray-500 mt-1">
                User ID: {user?.id}
              </p>
            )}
          </div>

          {/* Subscription Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Subscription Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(userProfile.subscriptionStatus)}`}>
                    {userProfile.subscriptionStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium text-gray-900">
                    {userProfile.planId.charAt(0).toUpperCase() + userProfile.planId.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Grace Period Ended:</span>
                  <span className="text-sm text-gray-900">
                    {format(gracePeriodEnd, 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Next Service Due:</span>
                  <span className="text-sm text-gray-900">
                    {format(nextServiceDate, 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Eligibility</h3>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-600 font-medium mb-2">Eligible for Service</p>
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="btn-primary w-full"
                >
                  Request Service
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="text-gray-900">{userProfile.address.city}, {userProfile.address.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-900">{userProfile.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Household:</span>
                  <span className="text-gray-900 capitalize">{userProfile.householdType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Furniture:</span>
                  <span className="text-gray-900 capitalize">{userProfile.furnitureType.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service History */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Service History</h3>
              <span className="text-sm text-gray-500">
                {serviceRequests.length} total requests
              </span>
            </div>

            <div className="space-y-4">
              {serviceRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {request.serviceType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Requested on {format(request.requestDate, 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRequestStatusColor(request.status)}`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{request.description}</p>
                  {request.scheduledDate && (
                    <p className="text-sm text-gray-600">
                      Scheduled for {format(request.scheduledDate, 'MMM dd, yyyy')}
                    </p>
                  )}
                  {request.technicianNotes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Technician Notes:</span> {request.technicianNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
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
                <p className="font-medium">Demo Mode</p>
                <p>This will simulate a service request submission</p>
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