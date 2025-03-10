import { NextAuthConfig } from "next-auth";

// This is a minimal config for edge compatibility
// It doesn't include any database operations
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/welcome",
  },
  providers: [], // Empty providers array for edge compatibility
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAuthRoute = 
        request.nextUrl.pathname.startsWith('/(auth)') ||
        request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname === '/register' ||
        request.nextUrl.pathname === '/welcome' ||
        request.nextUrl.pathname === '/';
      
      // Allow access to auth routes without login, require login for all other routes
      return isLoggedIn || isAuthRoute;
    },
  },
  trustHost: true, // Trust the host for authentication
  // No database adapter here
}; 