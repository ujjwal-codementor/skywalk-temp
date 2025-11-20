import { NextApiRequest, NextApiResponse } from 'next';
import { calComClient, isValidDate } from '@/lib/calcom';
import { checkAdmin } from '@/lib/checkAdmin';

interface BookingsResponse {
  message: string;
  count: number;
  bookings: Array<{
    id: number;
    name: string;
    email: string;
    startTime: string;
    endTime: string;
    phone?: string;
    address?: string;
  }>;
  error?: string;
}

interface CalComBooking {
  id: number;
  start: string;
  end: string;
  attendees: Array<{ name?: string; email?: string }>;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookingsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      message: 'Method not allowed',
      count: 0,
      bookings: [],
      error: 'Only GET method is allowed'
    });
  }

  const isAdmin = await checkAdmin(req);
  if(!isAdmin){
    return res.status(402).json({message: "Not a admin", count: 0, bookings: [], error: "Not a admin"});
  }

  try {
    const { date } = req.query;

    // Validate date parameter if provided
    if (date && typeof date === 'string') {
      if (!isValidDate(date)) {
        return res.status(400).json({
          message: 'Invalid date format',
          count: 0,
          bookings: [],
          error: 'Date must be in YYYY-MM-DD format'
        });
      }
    }

    // Fetch bookings from Cal.com

 
    const allBookings = await calComClient.getBookings(date as string);


    const transformedBookings = allBookings.flatMap((booking: CalComBooking) =>
      booking.attendees.map((attendee: any) => ({
        name: attendee.name,
        email: attendee.email,
        startTime: booking.start,
        endTime: booking.end,
        phone: attendee.bookingFieldsResponses.attendeePhoneNumber,
        address: attendee.bookingFieldsResponses.location.optionValue
      }))
    );
    
    
    // console.log(transformedBookings);
    


    const message = date 
      ? `Bookings for ${date}`
      : 'All bookings';

    return res.status(200).json({
      message,
      count: transformedBookings.length,
      bookings: transformedBookings
    });

  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    
    return res.status(500).json({
      message: 'Failed to fetch bookings',
      count: 0,
      bookings: [],
      error: error.message || 'Internal server error'
    });
  }
}


