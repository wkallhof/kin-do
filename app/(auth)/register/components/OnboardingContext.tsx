"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type OnboardingStep = "family" | "location" | "account";

interface FamilyMember {
  name: string;
  role: string;
  dateOfBirth?: Date;
}

interface OnboardingState {
  step: OnboardingStep;
  joiningExistingFamily: boolean;
  familyData: {
    familyName: string;
    primaryGuardian: {
      name: string;
      role: "primary_guardian" | "secondary_guardian";
      dateOfBirth?: Date;
    };
    additionalMembers: FamilyMember[];
    inviteCode?: string;
    familyMemberId?: number;
  };
  locationData: {
    home: {
      name: string;
      type: "home";
      availableThings: Record<string, boolean>;
    };
  };
}

const initialState: OnboardingState = {
  step: "family",
  joiningExistingFamily: false,
  familyData: {
    familyName: "",
    primaryGuardian: {
      name: "",
      role: "primary_guardian",
    },
    additionalMembers: [],
  },
  locationData: {
    home: {
      name: "Home",
      type: "home",
      availableThings: {},
    },
  },
};

interface OnboardingContextType {
  state: OnboardingState;
  setStep: (step: OnboardingStep) => void;
  updateFamilyData: (data: Partial<OnboardingState["familyData"]>) => void;
  updateLocationData: (data: Partial<OnboardingState["locationData"]>) => void;
  setJoiningExistingFamily: (value: boolean) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(() => {
    if (typeof window === "undefined") return initialState;
    const saved = localStorage.getItem("onboarding");
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem("onboarding", JSON.stringify(state));
  }, [state]);

  const setStep = (step: OnboardingStep) => {
    setState((prev) => ({ ...prev, step }));
  };

  const updateFamilyData = (data: Partial<OnboardingState["familyData"]>) => {
    setState((prev) => ({
      ...prev,
      familyData: { ...prev.familyData, ...data },
    }));
  };

  const updateLocationData = (data: Partial<OnboardingState["locationData"]>) => {
    setState((prev) => ({
      ...prev,
      locationData: { ...prev.locationData, ...data },
    }));
  };

  const setJoiningExistingFamily = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      joiningExistingFamily: value,
    }));
  };

  const resetOnboarding = () => {
    setState(initialState);
    localStorage.removeItem("onboarding");
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        setStep,
        updateFamilyData,
        updateLocationData,
        setJoiningExistingFamily,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
} 