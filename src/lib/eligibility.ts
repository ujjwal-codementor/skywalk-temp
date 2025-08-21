// Customer eligibility checker for appointment booking
// This function can be customized based on your business rules

export interface Customer {
  id?: string;
  name: string;
  email: string;
  subscriptionStatus?: 'active' | 'inactive' | 'expired';
  lastAppointment?: Date;
  totalAppointments?: number;
  // Add more fields as needed
}

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
  nextAvailableDate?: Date;
}

/**
 * Check if a customer is eligible for booking an appointment
 * @param customer - Customer information
 * @returns EligibilityResult with eligibility status and reason
 */
export function checkEligibility(customer: Customer): EligibilityResult {
  // Check if customer has basic required information
  if (!customer.name || !customer.email) {
    return {
      eligible: false,
      reason: 'Missing required customer information'
    };
  }

  // Check subscription status (if applicable)
  if (customer.subscriptionStatus && customer.subscriptionStatus !== 'active') {
    return {
      eligible: false,
      reason: `Subscription is ${customer.subscriptionStatus}. Active subscription required.`
    };
  }

  // Check appointment frequency (example: max 1 appointment per week)
  if (customer.lastAppointment) {
    const lastAppointment = new Date(customer.lastAppointment);
    const now = new Date();
    const daysSinceLastAppointment = Math.floor(
      (now.getTime() - lastAppointment.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastAppointment < 7) {
      const nextAvailableDate = new Date(lastAppointment);
      nextAvailableDate.setDate(nextAvailableDate.getDate() + 7);
      
      return {
        eligible: false,
        reason: 'Appointment frequency limit: minimum 7 days between appointments',
        nextAvailableDate
      };
    }
  }

  // Check total appointments limit (example: max 4 appointments per month)
  if (customer.totalAppointments && customer.totalAppointments >= 4) {
    return {
      eligible: false,
      reason: 'Monthly appointment limit reached (4 appointments per month)'
    };
  }

  // Customer is eligible
  return {
    eligible: true
  };
}

/**
 * Get next available appointment date for a customer
 * @param customer - Customer information
 * @returns Next available date or null if no restrictions
 */
export function getNextAvailableDate(customer: Customer): Date | null {
  const eligibility = checkEligibility(customer);
  
  if (eligibility.eligible) {
    return new Date(); // Available immediately
  }
  
  return eligibility.nextAvailableDate || null;
}

/**
 * Check if a specific date is available for a customer
 * @param customer - Customer information
 * @param requestedDate - Requested appointment date
 * @returns Whether the date is available
 */
export function isDateAvailable(customer: Customer, requestedDate: Date): boolean {
  const eligibility = checkEligibility(customer);
  
  if (!eligibility.eligible) {
    return false;
  }
  
  // Check if requested date is in the future
  const now = new Date();
  if (requestedDate <= now) {
    return false;
  }
  
  // Check if requested date respects frequency limits
  if (customer.lastAppointment) {
    const lastAppointment = new Date(customer.lastAppointment);
    const daysSinceLastAppointment = Math.floor(
      (requestedDate.getTime() - lastAppointment.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastAppointment < 7) {
      return false;
    }
  }
  
  return true;
}


