import { calComClient } from "@/lib/calcom";
import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";

import { NextApiRequest, NextApiResponse } from "next";

export default async function GET(
  req: NextApiRequest,
  res: NextApiResponse
){
    try {
        if(req.method !== "GET") {
            return res.status(405).json({ error: "Method not allowed, only GET is allowed" });
        }
        const { userId: clerkId } = getAuth(req);

        if (!clerkId) {
            return res.status(401).json({ error: "Unauthenticated" });
        }

        const user = await db.user.findUnique({
            where: {clerkId}
        })

        if(!user){
            return res.status(400).json({error : "User not found"});
        }

        // TODO
        // function call to access that user is elligible for booking

        const url = await calComClient.generateBookingLink();

        const finalUrl = new URL(url);
        finalUrl.searchParams.append('email', user.email);

        return res.status(200).json({url : finalUrl.toString()});
    }
    catch (error: any) {
        console.error(`Error in api/user/setDetails: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}