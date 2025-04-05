"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ProfileSheet } from "./profile-sheet";
import { ReactNode } from "react";

interface ProfileSheetToggleProps {
  title: string;
  description: string;
  sheetTitle?: string;
  sheetDescription?: string;
  icon: ReactNode;
  children: ReactNode;
}

export function ProfileSheetToggle({
  title,
  description,
  sheetTitle,
  sheetDescription,
  icon,
  children
}: ProfileSheetToggleProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <button 
        onClick={() => setIsSheetOpen(true)}
        className="flex items-center justify-between p-4 hover:bg-muted w-full rounded-md text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            {icon}
          </div>
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Settings Sheet */}
      <ProfileSheet 
        isOpen={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        title={sheetTitle || title}
        description={sheetDescription || description}
      >
        {children}
      </ProfileSheet>
    </>
  );
} 