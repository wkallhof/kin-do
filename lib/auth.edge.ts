import { NextAuthConfig } from "next-auth";

// This is a minimal config for edge compatibility
// It doesn't include any database operations
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [], // Empty providers array for edge compatibility
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = 
        request.nextUrl.pathname.startsWith('/activities') || 
        request.nextUrl.pathname.startsWith('/(authenticated)');
      
      // Allow public access to auth pages, require auth for protected routes
      return isLoggedIn || !isOnProtectedRoute;
    },
  },
  trustHost: true, // Trust the host for authentication
  // No database adapter here
}; 