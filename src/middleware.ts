import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteMatcher } from "@clerk/nextjs/server";

// Public routes (no auth required)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing",
  "/user/t&c",
]);

// Webhook routes (must bypass Clerk)
const isWebhookRoute = createRouteMatcher([
  "/api/webhook(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Skip Clerk on webhook routes
  if (isWebhookRoute(req)) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect everything else
  await auth.protect(); // ✅ correct in Clerk v5+
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)", // all pages except static assets
    "/api/(.*)",              // all API routes
  ],
};
