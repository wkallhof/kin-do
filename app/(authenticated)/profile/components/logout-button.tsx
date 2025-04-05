"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <Button 
      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" 
      variant="ghost"
      onClick={() => signOut({ callbackUrl: "/welcome" })}
    >
      <LogOut className="h-5 w-5 mr-2" />
      Log out
    </Button>
  );
} 