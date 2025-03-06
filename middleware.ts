import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Handle auth pages (login and register)
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token) {
      return NextResponse.redirect(new URL("/activities", request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes (anything in the authenticated group)
  if (pathname.startsWith("/(authenticated)") || pathname === "/activities") {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login/:path*",
    "/register/:path*",
    "/activities/:path*",
    "/(authenticated)/:path*"
  ],
}; 