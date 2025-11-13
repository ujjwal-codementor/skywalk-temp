import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize SES client
const ses = new SESClient({
  region: "us-east-2", // replace with your SES region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

// Simple HTML template function


// Function to send email
export async function sendPromotionalEmail(toEmail : string, fromEmail : string, subject : string, htmlContent : string) {
  const params = {
    Source: fromEmail, // must be under your verified domain
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: htmlContent } },
    },
  };

  try {
    const result = await ses.send(new SendEmailCommand(params));
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

// Bulk email sender with chunking (SES SendEmail supports up to 50 recipients per call, but we keep 25 to be safe)
export async function sendBulkPromotionalEmails(
  toEmails: string[],
  fromEmail: string,
  subject: string,
  htmlContent: string,
  chunkSize = 25
) {
  const normalized = Array.from(new Set(
    (toEmails || []).map((e) => (e || "").trim()).filter(Boolean)
  ));
  if (normalized.length === 0) return { success: true, sent: 0, errors: [] as string[] };

  const errors: string[] = [];
  let sent = 0;

  for (let i = 0; i < normalized.length; i += chunkSize) {
    const chunk = normalized.slice(i, i + chunkSize);
    const params = {
      Source: fromEmail,
      Destination: { ToAddresses: chunk },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: htmlContent } },
      },
    };
    try {
      await ses.send(new SendEmailCommand(params));
      sent += chunk.length;
      console.log("✅ Successfully sent bulk email chunk:", chunk);
    } catch (e: any) {
      console.error("❌ Error sending bulk email chunk:", e);
      errors.push(`chunk_${i}_${i + chunk.length - 1}`);
    }
  }

  return { success: errors.length === 0, sent, errors };
}
