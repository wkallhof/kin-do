import { NextResponse } from "next/server";
import { auth } from "./auth";

// This middleware runs on the edge
export default auth((req) => {
  // Get the absolute URL of the site from the request
  const baseUrl = req.nextUrl.origin;
  
  // If user is authenticated and trying to access auth pages, redirect to activities
  if (req.auth && (
    req.nextUrl.pathname.startsWith("/login") || 
    req.nextUrl.pathname.startsWith("/welcome") ||
    req.nextUrl.pathname.startsWith("/register")
  )) {
    return NextResponse.redirect(new URL("/activities", baseUrl));
  }
  
  // For unauthenticated users, we'll only protect specific routes
  // and let them access auth pages normally
  if (!req.auth) {
    // Only protect activities and authenticated routes
    if (
      req.nextUrl.pathname.startsWith("/activities") || 
      req.nextUrl.pathname.startsWith("/(authenticated)")
    ) {
      const loginUrl = new URL("/welcome", baseUrl);
      
      // Prevent redirect loops by checking if we're already coming from login
      const referer = req.headers.get("referer") || "";
      if (referer.includes("/welcome")) {
        // Don't redirect if already coming from login page
        // Just continue to the destination
        return NextResponse.next();
      }
      
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Otherwise, continue normally
  return NextResponse.next();
});

// Specify which routes this middleware applies to
export const config = {
  matcher: [
    "/login/:path*",
    "/welcome/:path*",
    "/register/:path*",
    "/activities/:path*",
    "/(authenticated)/:path*"
  ],
};