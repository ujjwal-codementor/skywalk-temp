import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";
import clerkClient from "./clerkClient";
import { db } from "./db";

const SUPER_ADMIN_EMAIL_1 = (process.env.SUPER_ADMIN_EMAIL_1 || "").toLowerCase();
const SUPER_ADMIN_EMAIL_2 = (process.env.SUPER_ADMIN_EMAIL_2 || "").toLowerCase();

export const checkAdmin = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) return false;
  try {
    const user = await clerkClient.users.getUser(userId);
    const primaryEmail = user.emailAddresses?.[0]?.emailAddress?.toLowerCase();
    if (!primaryEmail) return false;
    if (primaryEmail === SUPER_ADMIN_EMAIL_1 || primaryEmail === SUPER_ADMIN_EMAIL_2 ) return true;
    const admin = await db.admin.findFirst({
      where: { email: { equals: primaryEmail, mode: "insensitive" } },
    });
    return Boolean(admin);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// // Helper for app router route handlers (Request object based)
// export const checkAdminFromAuth = async (auth: { userId: string | null }) => {
//   const userId = auth.userId;
//   if (!userId) return false;
//   try {
//     const user = await clerkClient.users.getUser(userId);
//     const primaryEmail = user.emailAddresses?.[0]?.emailAddress?.toLowerCase();
//     if (!primaryEmail) return false;
//     const admin = await db.admin.findFirst({
//       where: { email: { equals: primaryEmail, mode: "insensitive" } },
//     });
//     return Boolean(admin);
//   } catch (error) {
//     console.error('Error checking admin status:', error);
//     return false;
//   }
// };

export const checkSuperAdmin = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) return false;
  try {
    const user = await clerkClient.users.getUser(userId);
    const primaryEmail = user.emailAddresses?.[0]?.emailAddress?.toLowerCase();
    if (!primaryEmail || (!SUPER_ADMIN_EMAIL_1 && !SUPER_ADMIN_EMAIL_2)) return false;
    return primaryEmail === SUPER_ADMIN_EMAIL_1 || primaryEmail === SUPER_ADMIN_EMAIL_2;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};


