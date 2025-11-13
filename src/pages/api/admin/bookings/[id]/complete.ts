import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { checkAdmin } from "@/lib/checkAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const isAdmin = await checkAdmin(req);
  if (!isAdmin) return res.status(401).json({ success: false, error: "Unauthorized" });

  const { id } = req.query as { id: string };
  if (!id) return res.status(400).json({ success: false, error: "Missing booking id" });

  const booking = await db.booking.update({
    where: { id },
    data: { completed: true },
  });

  return res.status(200).json({ success: true, data: booking });
}


