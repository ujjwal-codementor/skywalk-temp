import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';


export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = req.body;

        const { subscriptionType } = body;

        const { userId: clerkId } = getAuth(req);


        if (!clerkId || !subscriptionType) {
            console.log(body)
            console.log("heyy")
            return res.status(400).json({ error: "invalid arguements" })
        }

        // Check if a progress record already exists
        const existing = await db.progress.findUnique({
            where: { clerkId },
        });


        if (!existing) {
            // Create new if not found
            await db.progress.create({
                data: {
                    clerkId,
                    subscriptionType,
                    currentStep: 1
                },
            });
       
        } else if (existing.subscriptionType !== subscriptionType) {
            // Update only if subscriptionType is different
            await db.progress.update({
                where: { clerkId },
                data: {
                    subscriptionType,
                    currentStep: 1
                },
            });


        }

        return res.status(200).json({ message: "successs" });

    } catch (error: any) {
        console.error("Error in /api/progress:", error);
        return res.status(500).json({ error: "Internal server error" })
    }
}
