"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode } from "react";

interface ScrollDrawerProps {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  titleActions?: ReactNode;
}

export function ScrollDrawer({
  title,
  description,
  open,
  onOpenChange,
  children,
  titleActions,
}: ScrollDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-2xl mx-auto p-0">
        <div className="flex flex-col h-[90vh]">
          <div className="px-6 pt-4">
            <DrawerHeader className="p-0">
              <div className="flex items-center gap-2">
                <DrawerTitle className="text-xl">{title}</DrawerTitle>
                {description && (
                  <DrawerDescription className="sr-only">
                    {description}
                  </DrawerDescription>
                )}
                {titleActions}
              </div>
            </DrawerHeader>
          </div>

          <ScrollArea className="flex-1 overflow-auto px-6">
            <div className="space-y-6 pt-6 pb-6">
              {children}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 