"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { LogOut, Bell, CreditCard, User, FileText, HelpCircle, Users, ChevronRight, Palette } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  showIf?: boolean;
}

export function ProfileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const familyId = true; // This should be replaced with actual logic to check if user has a family ID

  const navItems: NavItem[] = [
    {
      title: "Account",
      href: "/profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Appearance",
      href: "/profile/appearance",
      icon: <Palette className="h-4 w-4" />,
    },
    {
      title: "Notifications",
      href: "/profile/notifications",
      icon: <Bell className="h-4 w-4" />,
    },
    {
      title: "Subscription",
      href: "/profile/subscription",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      title: "Support",
      href: "/profile/support",
      icon: <HelpCircle className="h-4 w-4" />,
    },
    {
      title: "Terms & Conditions",
      href: "/profile/terms",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Privacy Policy",
      href: "/profile/privacy",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Leave Family",
      href: "/profile/leave-family",
      icon: <Users className="h-4 w-4" />,
      showIf: familyId,
    },
  ];

  const filteredNavItems = navItems.filter(item => item.showIf !== false);
  
  // Get the current section title
  const currentSection = filteredNavItems.find(item => item.href === pathname)?.title || "Navigate to...";

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
      router.push("/welcome");
    } catch (error) {
      toast.error("Failed to log out");
      console.error(error);
    }
  };

  const handleNavChange = (value: string) => {
    if (value === "logout") {
      handleLogout();
    } else {
      router.push(value);
    }
  };

  // Mobile navigation
  const MobileNav = () => (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium text-muted-foreground">Current section:</h2>
      </div>
      <Select value={pathname} onValueChange={handleNavChange}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <SelectValue placeholder={currentSection} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {filteredNavItems.map((item) => (
            <SelectItem key={item.href} value={item.href}>
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.title}</span>
              </div>
            </SelectItem>
          ))}
          <SelectItem value="logout" className="text-destructive">
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  // Desktop navigation
  const DesktopNav = () => (
    <Card className="sticky top-24">
      <CardContent className="p-4">
        <nav className="space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
              {pathname === item.href && (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </Link>
          ))}
          <Button 
            variant="ghost"
            className="w-full justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-muted"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </Button>
        </nav>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="md:hidden">
        <MobileNav />
      </div>
      <div className="hidden md:block md:w-1/4 md:pr-8 md:mb-0">
        <DesktopNav />
      </div>
    </>
  );
} 