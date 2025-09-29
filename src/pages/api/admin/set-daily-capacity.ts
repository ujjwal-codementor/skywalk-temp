import { NextApiRequest, NextApiResponse } from 'next';
import { calComClient } from '@/lib/calcom';

interface SetCapacityRequest {
  capacity: number;
}

interface SetCapacityResponse {
  success: boolean;
  message: string;
  data?: {
    currentCapacity: number;
  };
  error?: string;
}

// Simple in-memory cache for daily capacity
// In production, consider using Redis or database for persistence


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SetCapacityResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      error: 'Only POST method is allowed'
    });
  }

  try {
    const { capacity }: SetCapacityRequest = req.body;

    // Validate input
    if (typeof capacity !== 'number' || capacity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid capacity value',
        error: 'Capacity must be a positive number'
      });
    }

    // Update daily capacity using Cal.com client
    const updatedEventType = await calComClient.updateDailyCapacity(capacity);



    return res.status(200).json({
      success: true,
      message: `Daily capacity updated to ${capacity} appointments`,
      data: {
        currentCapacity: capacity,
      }
    });

  } catch (error: any) {
    console.error('Error updating daily capacity:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update daily capacity',
      error: error.message || 'Internal server error'
    });
  }
}


