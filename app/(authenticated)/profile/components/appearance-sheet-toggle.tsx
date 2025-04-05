"use client";

import { Palette } from "lucide-react";
import { ThemeSettings } from "./theme-settings";
import { ProfileSheetToggle } from "./profile-sheet-toggle";

export function AppearanceSheetToggle() {
  return (
    <ProfileSheetToggle
      title="Appearance"
      description="Customize the app&apos;s theme and appearance"
      sheetTitle="Appearance"
      sheetDescription="Customize the look and feel of your Kin•Do experience"
      icon={<Palette className="h-5 w-5" />}
    >
      <ThemeSettings />
    </ProfileSheetToggle>
  );
} 