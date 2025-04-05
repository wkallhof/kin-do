import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, CreditCard, FileText, HelpCircle, Users, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  showIf?: boolean;
}

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/welcome');
  }
  
  const userEmail = session.user.email;
  if (!userEmail) {
    redirect('/welcome');
  }
  
  const user = await db.query.users.findFirst({
    where: eq(users.email, userEmail),
  });
  
  if (!user?.id) {
    redirect('/onboarding');
  }

  const navItems: NavItem[] = [
    {
      title: "Appearance",
      href: "/profile/appearance",
      icon: <Palette className="h-5 w-5" />,
      description: "Customize the app's theme and appearance",
    },
    {
      title: "Notifications",
      href: "/profile/notifications",
      icon: <Bell className="h-5 w-5" />,
      description: "Control how you receive notifications",
    },
    {
      title: "Subscription",
      href: "/profile/subscription",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Manage your subscription plan and payment details",
    },
    {
      title: "Support",
      href: "/profile/support",
      icon: <HelpCircle className="h-5 w-5" />,
      description: "Get help and contact support",
    },
    {
      title: "Terms & Conditions",
      href: "/profile/terms",
      icon: <FileText className="h-5 w-5" />,
      description: "Read our terms and conditions",
    },
    {
      title: "Privacy Policy",
      href: "/profile/privacy",
      icon: <FileText className="h-5 w-5" />,
      description: "Read our privacy policy",
    },
    {
      title: "Leave Family",
      href: "/profile/leave-family",
      icon: <Users className="h-5 w-5" />,
      description: "Remove yourself from your current family",
      showIf: true, // Should be replaced with actual logic to check family ID
    },
  ];

  const filteredNavItems = navItems.filter(item => item.showIf !== false);
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  return (
    <div className="space-y-6">
      <Link 
        href="/profile/account" 
        className="flex items-center justify-between p-4 rounded-md hover:bg-muted"
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium text-lg">{user.name}</h2>
            <p className="text-muted-foreground">Edit personal information</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Link>

      <Card>
        <CardContent className="p-0">
          <nav className="divide-y">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between p-4 hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
      
      <form action={async () => {
        'use server';
        // This is just a placeholder for the server action
        // In a real application, we would handle server-side logout logic here
      }}>
        <Button 
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" 
          variant="ghost"
          type="submit"
          formAction="/api/auth/signout"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Log out
        </Button>
      </form>
    </div>
  );
} 