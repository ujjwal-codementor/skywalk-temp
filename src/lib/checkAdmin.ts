import { auth } from '@clerk/nextjs/server';

interface CustomSessionClaims {
  metadata?: {
    role?: string;
  };
}

export const checkAdmin = async () => {
  const { sessionClaims } = await auth();

  const claims = sessionClaims as unknown as CustomSessionClaims;

  return claims.metadata?.role === "admin";
};