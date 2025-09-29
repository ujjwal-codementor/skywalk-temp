import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-pulse">
      <div className="container-width section-padding">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-96 mb-1"></div>
          <div className="h-3 bg-gray-300 rounded w-32"></div>
        </div>

        {/* Subscription Status Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="card">
            <div className="h-6 bg-gray-300 rounded w-40 mb-3"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 */}
          <div className="card">
            <div className="h-6 bg-gray-300 rounded w-40 mb-3"></div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card">
            <div className="h-6 bg-gray-300 rounded w-32 mb-3"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subscriptions History Skeleton */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-300 rounded w-40"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-40"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}








