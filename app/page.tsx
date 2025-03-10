import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Welcome to Kin•Do",
  description: "Your family's AI-powered daily activity planner",
};

export default async function WelcomePage() {
  const user = await getCurrentUser();
  
  if (user) {
    redirect("/activities");
  }

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white md:flex lg:h-full dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Kin•Do
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Create meaningful family moments with AI-powered daily activities, personalized for your family&apos;s unique needs and interests.
            </p>
          </blockquote>
        </div>
      </div>
      <div className="p-4 md:p-8 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="md:hidden flex items-center justify-center mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-10 w-10"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-2xl font-bold">Kin•Do</span>
          </div>
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to Kin•Do
            </h1>
            <p className="text-sm text-muted-foreground">
              Your family&apos;s personalized activity planner
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="/register" className="w-full">
              <Button className="w-full" size="lg">
                Get Started
              </Button>
            </Link>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                I Already Have an Account
              </Button>
            </Link>
          </div>
          <p className="md:hidden text-center text-sm text-muted-foreground mt-6">
            Create meaningful family moments with AI-powered daily activities, personalized for your family&apos;s unique needs and interests.
          </p>
        </div>
      </div>
    </div>
  );
} 