import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { AccountForm } from '../components/account-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfilePageLayout } from '../components/profile-page-layout';

export default async function AccountPage() {
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

  return (
    <ProfilePageLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account information and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading account information...</div>}>
              <AccountForm user={user} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </ProfilePageLayout>
  );
} 