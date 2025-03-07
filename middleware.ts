import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Use auth as middleware with custom logic
export default auth((req) => {
  // If user is authenticated and trying to access auth pages, redirect to activities
  if (req.auth && (
    req.nextUrl.pathname.startsWith("/login") || 
    req.nextUrl.pathname.startsWith("/register")
  )) {
    return NextResponse.redirect(new URL("/activities", req.nextUrl.origin));
  }
  
  // If user is not authenticated and trying to access protected routes,
  // the auth middleware will automatically redirect to login
});

// Specify which routes this middleware applies to
export const config = {
  matcher: [
    "/login/:path*",
    "/register/:path*",
    "/activities/:path*",
    "/(authenticated)/:path*"
  ],
};