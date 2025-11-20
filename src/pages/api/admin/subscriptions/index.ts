import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { checkAdmin } from "@/lib/checkAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const isAdmin = await checkAdmin(req);
  if (!isAdmin) return res.status(401).json({ success: false, error: "Unauthorized" });

  const subscriptions = await db.subscription.findMany({
    include: { user: true, payments: true },
    orderBy: { createdAt: "desc" },
  });
  return res.status(200).json({ success: true, data: subscriptions });
}



