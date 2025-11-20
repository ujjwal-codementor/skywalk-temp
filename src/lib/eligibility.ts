import {db} from "./db";

async function eligibleForService(userId: string) {

  try{
      const subscription = await db.subscription.findFirst({
        where:{
          userId,
          status : "active"
        }
      })

      if(!subscription){
        return false;
      }

      const today = new Date();
      const startDate = new Date(subscription.serviceStartTime);
      const threeMonths = new Date(subscription.serviceStartTime);
      threeMonths.setMonth(startDate.getMonth() + 3);
      const endDate = new Date(subscription.serviceEndTime);

      if(subscription.subscriptionType == "basic"){
        if(today >= startDate && today <= endDate){
          return true;
        }

      }
      else{

        if(today > threeMonths && today <= endDate && subscription.servicesLeft == 2){
          await db.subscription.update({
            where:{
              id: subscription.id
            },
            data:{
              servicesLeft : 1
            }
          })
        }

        if(today >= startDate && today <= threeMonths && subscription.servicesLeft == 2){
          return true;
        }

        if(today > threeMonths && today <= endDate && subscription.servicesLeft == 1){
          return true;
        }

      }
    
      return false;

  }
  catch(e){
    console.log("error in eligibility.ts: ", e)
    throw new Error("error in eligibility")
  }}

  export default eligibleForService
  
