
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import {getAuth} from '@clerk/nextjs/server'

export default async function GET(req: NextApiRequest, res: NextApiResponse) {

if(req.method == "GET"){
  try {
    const {userId : clerkId} = getAuth(req); 

    if (!clerkId) {
      return res.status(400).json({ error: "clerkId is required" });
    }

    const progress = await db.progress.findUnique({
      where: { clerkId },
      select: { 
        currentStep: true,
        subscriptionType: true
       },
    });

    if (!progress) {
      return res.status(400).json({ error: "Progress not found" });
    }

    return res.status(200).json({ currentStep: progress.currentStep,
    subscriptionType : progress.subscriptionType
     });

  } catch (error: any) {
    console.error("Error in /api/progress/get:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
else{
    return res.status(404).json({error: "only post req allowed"});
}
}
