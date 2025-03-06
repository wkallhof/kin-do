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

export function MainNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/activities", label: "Today's Activities", icon: Home },
    { href: "/favorites", label: "Favorites", icon: Star },
    { href: "/family", label: "My Family", icon: Users },
    { href: "/things", label: "My Things", icon: Package },
    { href: "/profile", label: "My Profile", icon: User },
  ];
  
  return (
    <div className="flex items-center">
      <Link href="/activities" className="mr-6 flex items-center space-x-2">
        <span className="font-bold">Kin•Do</span>
      </Link>
      
      <nav className="flex items-center space-x-4 lg:space-x-6">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            asChild
            className="h-9"
          >
            <Link
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );
} 