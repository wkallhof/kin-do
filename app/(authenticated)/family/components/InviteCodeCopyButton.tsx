"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface InviteCodeCopyButtonProps {
  inviteCode: string;
}

export function InviteCodeCopyButton({ inviteCode }: InviteCodeCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast.success("Invite code copied to clipboard");
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy invite code");
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={copyToClipboard}
      aria-label="Copy invite code to clipboard"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
} 