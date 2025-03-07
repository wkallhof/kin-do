import NextAuth, { DefaultSession, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

// Define session user type
interface SessionUser {
  id: string;
  email: string;
  name: string;
}

// Define credentials schema
const credentialsSchema = z.object({ 
  email: z.string().email("Invalid email address"), 
  password: z.string().min(6, "Password must be at least 6 characters") 
});

// Auth.js configuration
export const authConfig = {
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "hello@example.com" 
        },
        password: { 
          label: "Password", 
          type: "password",
          placeholder: "••••••••" 
        }
      },
      async authorize(credentials) {
        try {
          // Validate credentials with Zod
          const { email, password } = await credentialsSchema.parseAsync(credentials);
          
          // Find user in database
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user?.password) {
            return null;
          }

          // Verify password
          const passwordsMatch = await bcrypt.compare(password, user.password);

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
    async session({ session, token }: { 
      session: DefaultSession & { user: SessionUser }; 
      token: JWT;
    }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    }
  },
};

// Initialize NextAuth.js
export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);

// Helper function to get the current user
export async function getCurrentUser(): Promise<SessionUser | undefined> {
  const session = await auth();
  return session?.user;
}

// Type augmentation for TypeScript
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: SessionUser;
  }
}