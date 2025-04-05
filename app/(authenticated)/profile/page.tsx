import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, CreditCard, FileText, HelpCircle, Palette, Users, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccountSheetToggle } from './components/account-sheet-toggle';
import { LogoutButton } from './components/logout-button';
import { ThemeSettings } from './components/theme-settings';
import { ProfileSheetToggle } from './components/profile-sheet-toggle';
import { NotificationsForm } from './components/notifications-form';

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
      {/* Account profile section with sheet functionality */}
      <AccountSheetToggle user={user} initials={initials} />

      <Card>
        <CardContent className="p-0">
          <nav className="divide-y">
            {/* Appearance with sheet functionality */}
            <ProfileSheetToggle
              title="Appearance"
              description="Customize the app&apos;s theme and appearance"
              sheetTitle="Appearance"
              sheetDescription="Customize the look and feel of your Kin•Do experience"
              icon={<Palette className="h-5 w-5" />}
            >
              <ThemeSettings />
            </ProfileSheetToggle>

            {/* Notifications with sheet functionality */}
            <ProfileSheetToggle
              title="Notifications"
              description="Configure your notification preferences."
              sheetTitle="Notifications"
              sheetDescription="Configure your notification preferences."
              icon={<Bell className="h-5 w-5" />}
            >
              <NotificationsForm user={user} />
            </ProfileSheetToggle>

            {/* Other navigation items */}
            {filteredNavItems.map((item) => (
              <a
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
              </a>
            ))}
          </nav>
        </CardContent>
      </Card>
      
      <LogoutButton />
    </div>
  );
} 