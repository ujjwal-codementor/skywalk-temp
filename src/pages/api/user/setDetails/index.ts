import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function POST(
    req: NextApiRequest,
    res : NextApiResponse
) {
    try{
        if(req.method != "POST"){
        res.status(500).json({error: "only post method allowed"})
        }
        const {userId: clerkId} =  getAuth(req)
        const {fullName, email, phone, address} = req.body

        if(!clerkId){
            return res.status(400).json({error: "Unauthenticated"});
        }

        const user = await db.user.findUnique({
            where:{clerkId}
        })

        if(user){
            await db.user.update({
                where:{clerkId},
                data:{
                    email,
                    phone,
                    address,
                    fullName
                }
            })
        }

        else{
                await db.user.create({
                data:{
                    fullName,
                    email,
                    phone,
                    address,
                    clerkId
                }
            });

        }

        await db.progress.update({
            where:{clerkId},
            data:{
                currentStep: 2
            }
        })

        return res.status(200).json({message : "success"});

    }
    catch (error: any){
        console.log(`error in api/user/setDetails ${error}`);
        res.status(500).json({error: "Internal server error"});
    }
      
}