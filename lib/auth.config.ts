import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { compareSync } from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// This config is used by middleware and doesn't include database adapter
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        try {
          // Find user by email
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user || !user.password) return null;

          // Check if password matches
          const passwordsMatch = compareSync(password, user.password);
          if (!passwordsMatch) {
            return null;
          }

          // Return user data with id converted to string
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch {
          // Return null for any validation or other errors
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAuthRoute = 
        request.nextUrl.pathname.startsWith('/(auth)') ||
        request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname === '/register' ||
        request.nextUrl.pathname === '/';
      
      // Allow access to auth routes without login, require login for all other routes
      return isLoggedIn || isAuthRoute;
    },
  },
  // Add trusted hosts configuration for development and production
  trustHost: true,
} satisfies NextAuthConfig; 