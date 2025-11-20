import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { checkAdmin } from "@/lib/checkAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const isAdmin = await checkAdmin(req);
  if (!isAdmin) return res.status(401).json({ success: false, error: "Unauthorized" });

  const q = ((req.query.q as string) || "").trim();
  const email = ((req.query.email as string) || "").trim();
  const bookingId = ((req.query.bookingId as string) || "").trim();

  // Prefer explicit params; fallback to single q param
  const searchEmail = email || (q && q.includes("@") ? q : "");
  const searchId = bookingId || (q && !q.includes("@") ? q : "");

  if (!searchEmail && !searchId) {
    return res.status(200).json({ success: true, data: [] });
  }

  const bookings = await db.booking.findMany({
    where: {
      OR: [
        searchId ? { id: searchId } : undefined,
        searchEmail
          ? { user: { email: { contains: searchEmail, mode: "insensitive" } } }
          : undefined,
      ].filter(Boolean) as any,
    },
    include: {
      user: { select: { id: true, email: true, fullName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return res.status(200).json({ success: true, data: bookings });
}


