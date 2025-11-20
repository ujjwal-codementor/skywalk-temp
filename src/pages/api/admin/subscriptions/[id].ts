import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { checkAdmin } from "@/lib/checkAdmin";
import { stripe } from "@/lib/stripe";
import { calculateCancellationFee } from "@/lib/cancellationFeeCalculator";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAdmin = await checkAdmin(req);
  if (!isAdmin) return res.status(401).json({ success: false, error: "Unauthorized" });

  const { id } = req.query as { id: string };

  if (req.method === "GET") {
    const subscription = await db.subscription.findUnique({
      where: { id },
      include: { user: true, payments: true },
    });
    if (!subscription) return res.status(404).json({ success: false, error: "Not Found" });
    return res.status(200).json({ success: true, data: subscription });
  }

  if (req.method === "POST") {
    try {
      const action = (req.body?.action as string) || "";
      if (action !== "cancel") return res.status(400).json({ success: false, error: "Invalid action" });
      const mode = (req.body?.mode as string) || "withFee"; // "withFee" | "noFee"

      const subscription = await db.subscription.findUnique({ where: { id } });
      if (!subscription) return res.status(404).json({ success: false, error: "Not Found" });

      if (mode === "withFee") {
        const feeResult = calculateCancellationFee(
          subscription.subscriptionType,
          subscription.serviceEndTime.toISOString(),
          subscription.buyDate.toISOString()
        );
        if (feeResult.shouldApplyFee && feeResult.feeAmount > 0) {
          await stripe.invoiceItems.create({
            customer: subscription.stripeCustomerId,
            amount: feeResult.feeAmount * 100,
            currency: "usd",
            description: "Early cancellation fee",
            subscription: subscription.stripeSubscriptionId,
          });
        }
      }

      // Cancel on Stripe using stripeSubscriptionId (final invoice will be generated if invoice_now is true)
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId, {
        invoice_now: true,
        prorate: false,
      });

      return res.status(200).json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message || "Failed to cancel" });
    }
  }

  return res.status(405).end();
}



