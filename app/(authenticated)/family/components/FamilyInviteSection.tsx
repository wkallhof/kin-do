"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import { InviteCodeCopyButton } from "./InviteCodeCopyButton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FamilyInviteSectionProps {
  inviteCode: string;
}

export function FamilyInviteSection({ inviteCode }: FamilyInviteSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="max-w-xl">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <div className="px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-accent/50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="text-md font-medium">Invite Family Members</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share this code with family members so they can join your family.
              </p>

              <div className="flex items-center gap-2">
                <div className="bg-muted px-3 py-1.5 rounded-md font-mono text-lg tracking-wider">
                  {inviteCode}
                </div>
                <InviteCodeCopyButton inviteCode={inviteCode} />
              </div>

              <div className="text-sm text-muted-foreground border-t pt-3 text-xs">
                <p>
                  When someone uses this code during registration, they&apos;ll be able to join your family directly.
                  They&apos;ll need to create their own account, but will be connected to your family.
                </p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}