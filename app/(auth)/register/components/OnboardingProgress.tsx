"use client";

import { useOnboarding } from "./OnboardingContext";

const steps = [
  { id: "family", label: "Family" },
  { id: "location", label: "Location" },
  { id: "account", label: "Account" },
] as const;

export function OnboardingProgress() {
  const { state } = useOnboarding();
  const currentStepIndex = steps.findIndex((step) => step.id === state.step);

  return (
    <div className="relative mb-8">
      <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted">
        <div
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
          style={{
            width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      <div className="relative z-10 flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center"
            >
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full border-2 
                  ${
                    isCompleted || isCurrent
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs
                  ${isCurrent ? "font-medium text-primary" : "text-muted-foreground"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 