import {calComClient} from "@/lib/calcom";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler =   async (
    req : NextApiRequest,
    res : NextApiResponse
) => {

        const {uid, email} = req.body

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

            return res.status(200).json({message: "okay"})
        }
        catch{
            calComClient.cancelBooking(uid);

            return res.status(200).json({message: "cancelled due to some error"});
        }

}

export default handler;