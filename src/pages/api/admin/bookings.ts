import { NextApiRequest, NextApiResponse } from 'next';
import { calComClient, isValidDate } from '@/lib/calcom';

interface BookingsResponse {
  message: string;
  count: number;
  bookings: Array<{
    id: number;
    name: string;
    email: string;
    startTime: string;
    endTime: string;
  }>;
  error?: string;
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


    // Transform bookings to match expected format
    const transformedBookings = allBookings.map(booking => ({
      id: booking.id,
      name: booking.attendees[0]?.name || 'Unknown',
      email: booking.attendees[0]?.email || 'No email',
      startTime: booking.startTime,
      endTime: booking.endTime
    }));



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


