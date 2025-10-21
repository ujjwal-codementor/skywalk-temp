import axios, { AxiosResponse } from 'axios';
import { headers } from 'next/headers';


// Cal.com API base URL
const CALCOM_API_BASE = 'https://api.cal.com/v1';



// Cal.com API client class
class CalComClient {
  private apiKey: string;
  private eventTypeId: string;

  constructor() {
    this.apiKey = process.env.CALCOM_API_KEY!;
    this.eventTypeId = process.env.CALCOM_EVENT_TYPE_ID!;
    
    if (!this.apiKey) {
      throw new Error('CALCOM_API_KEY is required');
    }
    if (!this.eventTypeId) {
      throw new Error('CALCOM_EVENT_TYPE_ID is required');
    }
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  private getApiKeyParam() {
    return { apiKey: this.apiKey };
  }

  async getDailyCapacity() {
    const response = await axios.get(
      `${CALCOM_API_BASE}/event-types/${this.eventTypeId}`,
      { params: this.getApiKeyParam(),
        headers:{
          'Authorization': `Bearer ${this.apiKey}`
        }
      },
      
    );
    return response.data.event_type.seatsPerTimeSlot;
  }

  // Update event type daily capacity
  async updateDailyCapacity(capacity: number)  {
    try {
      const response = await axios.patch(
        `${CALCOM_API_BASE}/event-types/${this.eventTypeId}`,
        { seatsPerTimeSlot: capacity },
        { 
          params: this.getApiKeyParam(),
          headers: this.getHeaders() 
        }
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Error updating daily capacity:', error);
      throw new Error(`Failed to update daily capacity: ${error.message}`);
    }
  }

  async cancelBooking(bookingId : string){
    try{
      const res = await axios.post(`https://api.cal.com/v2/bookings/${bookingId}/cancel`,
        {
          cancellationReason: "cancelled by server",
          cancelSubsequentBookings: false
        },
        {
          headers:{
            'cal-api-version' : "2024-08-13",
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )


    }
    catch (e){
      console.log("error in cancelling bookin in calcom client" + e);
      // throw new Error(`error in cancelling booking  ${e}`)
    }
  }

  async generateBookingLink(): Promise<string> {
  try {
    const response: AxiosResponse<{ data: { bookingUrl: string } }> = await axios.post(
      `https://api.cal.com/v2/event-types/${this.eventTypeId}/private-links`,
      {
        maxUsageCount : 1
      },
      {headers:{
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          }}
    );

    return `${response.data.data.bookingUrl}/service`

  } catch (error: any) {
    console.error("Error generating booking link:", error.response?.data || error.message);
    throw new Error(`Failed to generate booking link: ${error.message}`);
  }
}




  // Get all bookings for the event type
  async getBookings(date?: string) {
    try {
      const params: any = {
      eventTypeId: this.eventTypeId,
    };

    if (date) {
      const startDate = new Date(date);
      const nextDate = new Date(startDate);
      nextDate.setDate(startDate.getDate() + 1);

      // console.log(startDate)
      // console.log(nextDate)

      params.afterStart = startDate.toISOString();
      params.beforeEnd = nextDate.toISOString();
      params.status ="upcoming"
    }

      const response: AxiosResponse<{ status: string; data: any }> = await axios.get(
        `https://api.cal.com/v2/bookings`,
        {
          params,
          headers:{
            'Authorization': `Bearer ${this.apiKey}`,
            'cal-api-version' : "2024-08-13"
          }
        }
      );


      if (!response) {
        throw new Error(response);
      }
      // console.log(response.data.data)

      return response.data.data || [];

    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
  }


}

// Export singleton instance
export const calComClient = new CalComClient();

// Helper function to format date for Cal.com API
export function formatDateForCalCom(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

// Helper function to check if date is valid
export function isValidDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

