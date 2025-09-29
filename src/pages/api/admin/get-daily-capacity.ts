import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from '@clerk/nextjs/server';
import { checkAdmin } from '@/lib/checkAdmin';
import { calComClient } from "@/lib/calcom";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is admin
    // const isAdmin = await checkAdmin();
    // if (!isAdmin) {
    //   return res.status(403).json({ error: 'Forbidden: Admin access required' });
    // }

    const cachedCapacity = await calComClient.getDailyCapacity();

    if (cachedCapacity) {
      // Return cached capacity
      return res.status(200).json({
        success: true,
        data: {
          current: cachedCapacity,
        }
      });
    }

    // TODO: Replace this with actual CalCom client call

    const dummyCapacity = {
      current: 2,
    };

    // Simulate CalCom client call (replace this with actual implementation)
    console.log("Making dummy call to CalCom client for daily capacity...");
    
    // Return the capacity data
    return res.status(200).json({
      success: true,
      data: dummyCapacity
    });

  } catch (error: any) {
    console.error('Error in /api/admin/get-daily-capacity:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
