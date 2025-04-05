"use client";

import { ChevronLeft } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AccountForm } from "./account-form";

interface AccountSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export function AccountSheet({ isOpen, onOpenChange, user }: AccountSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto [&>button:first-child]:hidden">
        <SheetHeader className="mb-6 pb-4 border-b">
          <div className="flex items-center relative">
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full absolute left-0">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </SheetClose>
            <SheetTitle className="w-full text-center">Account</SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Manage your account information and password
          </SheetDescription>
        </SheetHeader>
        <AccountForm user={user} />
      </SheetContent>
    </Sheet>
  );
} 