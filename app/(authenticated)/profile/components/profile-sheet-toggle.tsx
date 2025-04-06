"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ProfileSheet } from "./profile-sheet";
import { ReactNode } from "react";

interface ProfileSheetToggleProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export function ProfileSheetToggle({
  title,
  description,
  icon,
  children
}: ProfileSheetToggleProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <button 
        onClick={() => setIsSheetOpen(true)}
        className="flex items-start justify-between p-4 hover:bg-muted w-full text-left"
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            {icon}
          </div>
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-2" />
      </button>

      {/* Settings Sheet */}
      <ProfileSheet 
        isOpen={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        title={title}
        description={description}
      >
        {children}
      </ProfileSheet>
    </>
  );
} 