import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { checkSuperAdmin } from "@/lib/checkAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isSuper = await checkSuperAdmin(req);
  if (!isSuper) return res.status(401).json({ success: false, error: "Unauthorized" });

  if (req.method === "GET") {
    const admins = await db.admin.findMany({ orderBy: { createdAt: "desc" } });
    return res.status(200).json({ success: true, data: admins });
  }

  if (req.method === "POST") {
    try {
      const action = (req.body?.action as string) || "";
      if (action === "delete") {
        const { id, email } = req.body as { id?: string; email?: string };
        if (!id && !email) {
          return res.status(400).json({ success: false, error: "id or email required" });
        }
        if (id) {
          await db.admin.delete({ where: { id } });
        } else if (email) {
          await db.admin.delete({ where: { email } });
        }
        return res.status(200).json({ success: true });
      }

      const { name, email } = req.body as { name?: string; email?: string };
      if (!name || !email) {
        return res.status(400).json({ success: false, error: "name and email are required" });
      }
      const created = await db.admin.create({ data: { name, email: email.toLowerCase() } });
      return res.status(201).json({ success: true, data: created });
    } catch (e: any) {
      const message = (e?.code === "P2002") ? "Admin with this email already exists" : (e?.message || "Failed");
      return res.status(500).json({ success: false, error: message });
    }
  }

  return res.status(405).end();
}


