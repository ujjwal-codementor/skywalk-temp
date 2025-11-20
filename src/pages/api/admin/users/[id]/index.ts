import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { checkAdmin } from "@/lib/checkAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const isAdmin = await checkAdmin(req);
  if (!isAdmin) return res.status(401).json({ success: false, error: "Unauthorized" });
  const { id } = req.query as { id: string };
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ success: false, error: "Not Found" });
  return res.status(200).json({ success: true, data: user });
}



