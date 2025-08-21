// Demo data for the furniture wellness application

export const DEMO_USER_PROFILE = {
  uid: 'demo-user-123',
  email: 'demo@furniturewellness.com',
  name: 'Sarah Johnson',
  subscriptionStatus: 'active' as const,
  planId: 'standard' as const,
  subscriptionStartDate: new Date('2024-01-15'),
  gracePeriodEndDate: new Date('2024-04-15'),
  lastServiceDate: new Date('2024-10-15'),
  nextEligibleServiceDate: new Date('2024-12-15'),
  address: {
    street: '123 Oak Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102'
  },
  phone: '(555) 123-4567',
  householdType: 'pets' as const,
  furnitureType: ['wood', 'leather'] as const
};

export const DEMO_SERVICE_REQUESTS = [
  {
    id: 'req-001',
    userId: 'demo-user-123',
    planId: 'standard',
    requestDate: new Date('2024-11-01'),
    scheduledDate: new Date('2024-11-15'),
    status: 'completed' as const,
    description: 'Coffee table has water stains and scratches from kids toys. Also need touch-up on dining chair arm.',
    serviceType: 'subscription_touch_up' as const,
    technicianNotes: 'Completed water stain removal and scratch repair. Applied protective coating to prevent future damage.'
  },
  {
    id: 'req-002',
    userId: 'demo-user-123',
    planId: 'standard',
    requestDate: new Date('2024-09-10'),
    scheduledDate: new Date('2024-09-20'),
    status: 'completed' as const,
    description: 'Leather sofa has cat scratches on the arm rest. Need repair and conditioning.',
    serviceType: 'subscription_touch_up' as const,
    technicianNotes: 'Repaired cat scratches using leather repair compound. Applied conditioning treatment to entire sofa.'
  },
  {
    id: 'req-003',
    userId: 'demo-user-123',
    planId: 'standard',
    requestDate: new Date('2024-07-05'),
    scheduledDate: new Date('2024-07-18'),
    status: 'completed' as const,
    description: 'Annual maintenance service - general inspection and touch-ups needed.',
    serviceType: 'subscription_touch_up' as const,
    technicianNotes: 'Performed comprehensive inspection. Minor touch-ups on dining table and bookshelf. All furniture in excellent condition.'
  },
  {
    id: 'req-004',
    userId: 'demo-user-123',
    planId: 'standard',
    requestDate: new Date('2024-12-01'),
    status: 'pending' as const,
    description: 'Holiday preparation - need touch-up on entertainment center before family visits.',
    serviceType: 'subscription_touch_up' as const
  }
];



export const isEligibleForService = () => {
  // For demo, user is always eligible
  return true;
};