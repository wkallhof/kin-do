import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, FileText, HelpCircle, Palette, Users, Bell } from 'lucide-react';
import { AccountSheetToggle } from './components/account-sheet-toggle';
import { LogoutButton } from './components/logout-button';
import { ThemeSettings } from './components/theme-settings';
import { ProfileSheetToggle } from './components/profile-sheet-toggle';
import { NotificationsForm } from './components/notifications-form';
import { SubscriptionInfo } from './components/subscription-info';
import { SupportForm } from './components/support-form';
import Terms from './components/terms';
import PrivacyPolicy from './components/privacy-policy';
import LeaveFamilyForm from './components/leave-family-form';

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

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  return (
    <div className="space-y-6">

      {/* Account profile section with sheet functionality */}
      <AccountSheetToggle user={user} initials={initials} />

      <Card>
        <CardContent className="p-0">
          <nav className="divide-y">


            {/* Notifications with sheet functionality */}
            <ProfileSheetToggle
              title="Notifications"
              description="Configure your notification preferences."
              icon={<Bell className="h-5 w-5" />}
            >
              <NotificationsForm user={user} />
            </ProfileSheetToggle>

            {/* Subscription with sheet functionality */}
            <ProfileSheetToggle
              title="Subscription"
              description="Manage your subscription plan and payment details."
              icon={<CreditCard className="h-5 w-5" />}
            >
              <SubscriptionInfo user={user} />
            </ProfileSheetToggle>

            {/* Appearance with sheet functionality */}
            <ProfileSheetToggle
              title="Appearance"
              description="Customize the app&apos;s theme and appearance"
              icon={<Palette className="h-5 w-5" />}
            >
              <ThemeSettings />
            </ProfileSheetToggle>

            {/* Support with sheet functionality */}
            <ProfileSheetToggle
              title="Support"
              description="Get help and contact support."
              icon={<HelpCircle className="h-5 w-5" />}
            >
              <SupportForm user={user} />
            </ProfileSheetToggle>

            {/* Terms & Conditions with sheet functionality */}
            <ProfileSheetToggle
              title="Terms & Conditions"
              description="Read our terms and conditions."
              icon={<FileText className="h-5 w-5" />}
            >
              <Terms />
            </ProfileSheetToggle>

            {/* Privacy Policy with sheet functionality */}
            <ProfileSheetToggle
              title="Privacy Policy"
              description="Read our privacy policy."
              icon={<FileText className="h-5 w-5" />}
            >
              <PrivacyPolicy />
            </ProfileSheetToggle>

            {/* Leave Family with sheet functionality */}
            <ProfileSheetToggle
              title="Leave Family"
              description="Remove yourself from your current family group"
              icon={<Users className="h-5 w-5" />}
            >
              <LeaveFamilyForm />
            </ProfileSheetToggle>

          </nav>
        </CardContent>
      </Card>
      
      <LogoutButton />
    </div>
  );
} 