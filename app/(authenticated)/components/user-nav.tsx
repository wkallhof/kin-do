"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  return (
    <div className="flex items-center space-x-2">
      <ThemeToggle />
      <Button variant="ghost" className="relative h-8 w-8 rounded-full" asChild>
        <Link href="/profile">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={user.name || ""} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
        </Link>
      </Button>
    </div>
  );
} 