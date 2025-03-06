"use client";

import { FamilyProfileStep } from "./OnboardingFlow/FamilyProfileStep";
import { LocationStep } from "./OnboardingFlow/LocationStep";
import { AccountStep } from "./OnboardingFlow/AccountStep";
import { useOnboarding } from "./OnboardingContext";

export function OnboardingStepContent() {
  const { state } = useOnboarding();

  switch (state.step) {
    case "family":
      return <FamilyProfileStep />;
    case "location":
      return <LocationStep />;
    case "account":
      return <AccountStep />;
    default:
      return null;
  }
} 