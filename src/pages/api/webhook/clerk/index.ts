import { verifyWebhook } from "@clerk/backend/webhooks";
import { NextApiRequest, NextApiResponse } from "next";
import { sendPromotionalEmail} from "@/lib/emailses";
import { welcomeEmail } from "@/lib/emailTemplates";

const sendFromEmail = process.env.NOTIFICATIONS_FROM_EMAIL || "info@furnishcare.com";

const options = {
  signingSecret: process.env.CLERK_WEBHOOK_SECRET! as string,
}

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = JSON.stringify(req.body);
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) headers.set(key, value.join(","));
      else if (value) headers.set(key, value as string);
    }

    const webRequest = new Request("https://furnishcare.com/api/webhook/clerk", {
      method: req.method,
      headers,
      body,
    });

    // ✅ Verify the webhook
    const evt = await verifyWebhook(webRequest, options);

    if (evt.type == "user.created") {
       
      const email = welcomeEmail({
        fullName: evt.data.first_name!,
      })

      const sendToEmail = evt.data.email_addresses[0].email_address;

      await sendPromotionalEmail(sendToEmail, sendFromEmail, email.subject, email.html);

    }

    return res.status(200).send("Success");
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }
}