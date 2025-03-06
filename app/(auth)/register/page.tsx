import { Metadata } from "next";
import { OnboardingProvider } from "./components/OnboardingContext";
import { OnboardingProgress } from "./components/OnboardingProgress";
import { OnboardingStepContent } from "./components/OnboardingStepContent";

export const metadata: Metadata = {
  title: "Get Started | Kin•Do",
  description: "Create your Kin•Do account and start planning family activities",
};

export default function RegisterPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative flex h-full flex-col bg-muted p-10 text-white lg:h-full dark:border-r">
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
              Join thousands of families creating memorable moments with AI-powered activity suggestions.
            </p>
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <OnboardingProvider>
            <OnboardingProgress />
            <OnboardingStepContent />
          </OnboardingProvider>
        </div>
      </div>
    </div>
  );
} 