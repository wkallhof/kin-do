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
import { ReactNode } from "react";

interface ProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export function ProfileSheet({ 
  isOpen, 
  onOpenChange, 
  title, 
  description, 
  children 
}: ProfileSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col [&>button:first-child]:hidden">
        <SheetHeader className="sticky top-0 z-10 bg-background pb-4 border-b">
          <div className="flex items-center relative">
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full absolute left-0">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </SheetClose>
            <SheetTitle className="w-full text-center">{title}</SheetTitle>
          </div>
          {description && (
            <SheetDescription className={description === "sr-only" ? "sr-only" : ""}>
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
} 