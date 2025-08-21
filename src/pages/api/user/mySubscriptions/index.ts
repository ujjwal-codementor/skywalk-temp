import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server'
import { db } from "@/lib/db";

export async function mySubs(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method == "GET") {
        try {
            const { userId: clerkId } = getAuth(req);

            if (!clerkId) {
                return res.status(401).json({ error: 'Unauthorized' })
            }

            const user = await db.user.findUnique({
                where: {
                    clerkId
                },
                select:{
                    subscriptions: true
                }
            })

            if (!user) {
                return res.status(200).json({ subscriptions: [] })
            }

            return res.status(200).json({ subscriptions: user.subscriptions})
        }
        catch {
            console.log("Error in the GET api/user/mySubscriptions")
            return res.status(500).json({ error: "Internal server error" })
        }
    }
    else {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}