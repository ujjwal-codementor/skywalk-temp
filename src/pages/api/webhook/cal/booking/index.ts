import {calComClient} from "@/lib/calcom";
import { db } from "@/lib/db";
import { sendPromotionalEmail } from "@/lib/emailses";
import { bookingAcknowledgementEmail } from "@/lib/emailTemplates";
import { NextApiRequest, NextApiResponse } from "next";

const sendFromEmail = process.env.NOTIFICATIONS_FROM_EMAIL || "info@furnishcare.com";

const handler =   async (
    req : NextApiRequest,
    res : NextApiResponse
) => {

        const {uid, email, location, startTime} = req.body


        try{
        

            const user = await db.user.findUnique({
                where:{
                    email
                }
            })

            if(!user){
                calComClient.cancelBooking(uid);

                return res.status(200).json({message : "cancelled due to user not found"})
            }

            const sub = await db.subscription.findFirst({
                where:{
                    userId : user.id,
                    status : "active"
                }
            })

             if(!sub){
                return res.status(200).json({message : "cancelled due to user not found"})
            }

            console.log(sub.id);

            await db.subscription.update({
                where:{
                    id: sub.id
                },
                data:{
                    servicesLeft : sub.servicesLeft - 1
                }
            })

            await db.booking.create({
                data:{
                    calcomId : uid,
                    userId : user.id
                }
            })

            const notificationEmail = bookingAcknowledgementEmail({
                fullName: user.fullName,
                bookingId: uid,
                date: startTime,
                address: location
            })
            
            await sendPromotionalEmail(user.email, sendFromEmail, notificationEmail.subject, notificationEmail.html);

            return res.status(200).json({message: "okay"})
        }
        catch{
            calComClient.cancelBooking(uid);

            return res.status(200).json({message: "cancelled due to some error"});
        }

}

export default handler;