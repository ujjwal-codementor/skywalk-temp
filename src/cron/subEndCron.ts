import { db } from "@/lib/db";
import { sendPromotionalEmail } from "@/lib/emailses";
import { subscriptionEndingEmail, subscriptionExpiredEmail } from "@/lib/emailTemplates";

const sendFromEmail = process.env.NOTIFICATIONS_FROM_EMAIL || "info@furnishcare.com";

function daysBetween(date1: Date, date2: Date) {
    const d1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.ceil((d1 - d2) / (1000 * 60 * 60 * 24));
  }
  
  

export default async function Cron() {
    const today = new Date();
    const fortnight = new Date(today);
    fortnight.setDate(fortnight.getDate() + 14);

    const prevFortnight = new Date(today);
    prevFortnight.setDate(prevFortnight.getDate() - 14);

    const subs = await db.subscription.findMany({
        where: {
            status: "active",
            serviceEndTime: {
                gte: today,
                lte: fortnight
            }
        },
        select: {
            user: true,
            serviceEndTime: true,
            subscriptionType: true
        }
    });

    const expiredSubs = await db.subscription.findMany({
        where: {
            status: "expired",
            serviceEndTime: {
                gte: prevFortnight
            },
        },
        select:{
            user: true,
            subscriptionType: true,
            serviceEndTime: true
        }
    });

    for(const expiredSub of expiredSubs){
        const email = expiredSub.user.email;
        const notificationEmail = subscriptionExpiredEmail({
            fullName: expiredSub.user.fullName,
            planName: `${expiredSub.subscriptionType} plan` ,
        })
        await sendPromotionalEmail(email, sendFromEmail, notificationEmail.subject, notificationEmail.html);
    }
    
    for(const sub of subs){
        const daysRemaining = daysBetween(sub.serviceEndTime, new Date());
        const email = sub.user.email;
        const notificationEmail = subscriptionEndingEmail({
            fullName: sub.user.fullName,
            planName: `${sub.subscriptionType} plan`,
            remainingDays: daysRemaining,
        })
        await sendPromotionalEmail(email, sendFromEmail, notificationEmail.subject, notificationEmail.html);
    }
}

