"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Star, 
  Users, 
  Package, 
  User,
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/activities", label: "Activities", icon: Home },
    { href: "/favorites", label: "Favorites", icon: Star },
    { href: "/family", label: "Family", icon: Users },
    { href: "/things", label: "Things", icon: Package },
    { href: "/profile", label: "Profile", icon: User },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "relative flex-col h-16 px-2 hover:bg-transparent transition-colors",
                isActive && "text-primary before:absolute before:h-1 before:w-12 before:rounded-full before:bg-primary before:-top-0.5"
              )}
            >
              <Link href={item.href} className="flex flex-col items-center">
                <item.icon className={cn(
                  "h-5 w-5 mb-1 transition-transform",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
} 