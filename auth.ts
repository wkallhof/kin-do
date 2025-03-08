// Re-export auth from NextAuth with edge-compatible config
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.edge";

// Initialize NextAuth.js with edge-compatible config
export const { auth } = NextAuth(authConfig); 