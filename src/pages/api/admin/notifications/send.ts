import type { NextApiRequest, NextApiResponse } from "next";
import { checkAdmin } from "@/lib/checkAdmin";
import { db } from "@/lib/db";
import { sendBulkPromotionalEmails } from "@/lib/emailses";
import { sanitizeEmailHtml } from "@/lib/sanitizeEmailHtml";
import { customEmail } from "@/lib/emailTemplates";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAdmin = await checkAdmin(req);
  if (!isAdmin) return res.status(401).json({ success: false, error: "Unauthorized" });

  if (req.method !== "POST") return res.status(405).end();

  try {
    const body = req.body || {};
    const subject = (body.subject as string) || "";
    const html = (body.html as string) || "";
    const toEmails = (body.toEmails as string[] | undefined) || [];
    const target = (body.target as "all" | "selected") || (toEmails.length ? "selected" : "selected");
    const fromEmail = process.env.NOTIFICATIONS_FROM_EMAIL || process.env.SES_FROM_EMAIL || "";

    if (!fromEmail) return res.status(400).json({ success: false, error: "Missing from email env (NOTIFICATIONS_FROM_EMAIL or SES_FROM_EMAIL)" });
    if (!subject.trim()) return res.status(400).json({ success: false, error: "Subject is required" });
    if (!html.trim()) return res.status(400).json({ success: false, error: "HTML content is required" });

    const sanitized = sanitizeEmailHtml(html);
    const notificationEmail = customEmail({
      bodyHtml: sanitized,
    });

    let recipients: string[] = [];
    if (target === "all") {
      // Fetch all user emails in batches
      const batchSize = 500;
      let skip = 0;
      while (true) {
        const users = await db.user.findMany({
          skip,
          take: batchSize,
          select: { email: true },
          orderBy: { createdAt: "asc" },
        });
        if (!users.length) break;
        recipients.push(...users.map((u) => u.email));
        skip += users.length;
        if (users.length < batchSize) break;
      }
    } else {
      recipients = toEmails;
    }

    if (!recipients.length) return res.status(400).json({ success: false, error: "No recipients" });

    const { success, sent, errors } = await sendBulkPromotionalEmails(recipients, fromEmail, subject, notificationEmail.html);
    return res.status(200).json({ success, sent, errors, totalRecipients: recipients.length });
  } catch (e: any) {
    console.error("Failed to send notifications:", e);
    return res.status(500).json({ success: false, error: e?.message || "Failed" });
  }
}

