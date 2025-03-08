import { DefaultSession } from "next-auth";

// Define session user type
interface SessionUser {
  id: string;
  email: string;
  name: string;
}

// Type augmentation for NextAuth
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: SessionUser;
  }
}

// Type augmentation for NextAuth JWT
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

// Type augmentation for Next.js middleware
declare module "next/server" {
  interface NextRequest {
    auth?: {
      user?: SessionUser;
    };
  }
} 