"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { AccountSheet } from "./account-sheet";

interface AccountSheetToggleProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
  initials: string;
}

export function AccountSheetToggle({ user, initials }: AccountSheetToggleProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      {/* Account info with Sheet trigger */}
      <button 
        onClick={() => setIsSheetOpen(true)}
        className="w-full flex items-center justify-between p-4 rounded-md hover:bg-muted text-left"
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium text-lg">{user.name}</h2>
            <p className="text-muted-foreground">Edit personal information</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Profile Sheet */}
      <AccountSheet 
        isOpen={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        user={user} 
      />
    </>
  );
} 