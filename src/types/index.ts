// Simplified types for demo version - no Firebase imports needed

// User Profile Interface
export interface UserProfile {
  uid: string;
  email?: string;
  name?: string;
  subscriptionStatus: 'none' | 'active' | 'grace_period' | 'cancelled';
  planId?: 'basic' | 'standard' | 'premium';
  subscriptionStartDate?: Date;
  gracePeriodEndDate?: Date;
  lastServiceDate?: Date;
  nextEligibleServiceDate?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone?: string;
  householdType?: 'kids' | 'pets' | 'none';
  furnitureType?: ('wood' | 'leather' | 'fabric')[];
}

// Service Request Interface
export interface ServiceRequest {
  id?: string;
  userId: string;
  planId: string;
  requestDate: Date;
  scheduledDate?: Date;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  description: string;
  photos?: string[];
  serviceType: 'subscription_touch_up' | 'deep_polish' | 'refinishing' | 'upholstery_cleaning';
  cost?: number;
  technicianNotes?: string;
}

// Subscription Plan Interface
export interface SubscriptionPlan {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  price: number;
  frequency: number; // months between services
  features: string[];
  stripePrice: string;
}

// Auth Context Interface
export interface AuthContextType {
  user: any;
  userId: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Stripe Checkout Session Response
export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}