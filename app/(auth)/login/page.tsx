import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign In | Kin•Do",
  description: "Sign in to your Kin•Do account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your Kin•Do account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link 
              href="/register" 
              prefetch={true}
              legacyBehavior={false}
              className="text-primary hover:underline"
            >
              Get started
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 