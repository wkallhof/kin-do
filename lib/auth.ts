import NextAuth, { DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { authConfig } from "./auth.config";

// Define session user type
interface SessionUser {
  id: string;
  email: string;
  name: string;
}

// Auth.js configuration with full features
export const config = {
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
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

// Initialize NextAuth.js with the full config
export const { auth, signIn, signOut, handlers } = NextAuth(config);

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