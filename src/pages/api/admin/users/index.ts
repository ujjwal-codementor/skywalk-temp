import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { checkAdmin } from "@/lib/checkAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAdmin = await checkAdmin(req);
  if (!isAdmin) return res.status(401).json({ success: false, error: "Unauthorized" });

  if (req.method === "GET") {
    const q = ((req.query.q as string) || "").trim();
    const email = ((req.query.email as string) || "").trim();
    const name = ((req.query.name as string) || "").trim();
    const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt((req.query.pageSize as string) || "20", 10)));

    const searchEmail = email || (q && q.includes("@") ? q : "");
    const searchName = name || (q && !q.includes("@") ? q : "");

    const filters = [
      searchEmail ? { email: { contains: searchEmail, mode: "insensitive" } } : undefined,
      searchName ? { fullName: { contains: searchName, mode: "insensitive" } } : undefined,
    ].filter(Boolean) as any[];

    const where: any | undefined = filters.length ? { AND: filters } : undefined;

    const [total, users] = await Promise.all([
      db.user.count({ where }),
      db.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, email: true, fullName: true, createdAt: true },
      }),
    ]);

    return res.status(200).json({ success: true, data: users, page, pageSize, total });
  }

  return res.status(405).end();
}



