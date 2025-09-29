import {  getAuth } from "@clerk/nextjs/server";
import {NextApiRequest} from "next";

export const checkAdmin =  (req: NextApiRequest) => {
  const { sessionClaims } =  getAuth(req);
  console.log(sessionClaims)
  return sessionClaims?.role === "admin";
};
