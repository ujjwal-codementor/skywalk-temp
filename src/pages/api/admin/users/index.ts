import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { checkAdmin } from "@/lib/checkAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const isAdmin = await checkAdmin(req);
  if (!isAdmin) return res.status(401).json({ success: false, error: "Unauthorized" });

  const email = (req.query.email as string) || "";
  if (!email) return res.status(200).json({ success: true, data: [] });
  const users = await db.user.findMany({
    where: { email: { contains: email, mode: "insensitive" } },
    take: 20,
  });
  return res.status(200).json({ success: true, data: users });
}



