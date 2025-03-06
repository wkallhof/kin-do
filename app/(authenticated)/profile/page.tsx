import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { Metadata } from 'next';
import { PageHeader } from '@/app/(authenticated)/components/page-header';
import { ProfileForm } from './components/profile-form';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'My Profile | Kin•Do',
  description: 'Manage your account settings and preferences',
};

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/login');
  }
  
  const userEmail = session.user.email;
  if (!userEmail) {
    redirect('/login');
  }
  
  const user = await db.query.users.findFirst({
    where: eq(users.email, userEmail),
  });
  
  if (!user?.id) {
    redirect('/onboarding');
  }

  return (
    <main className="container max-w-2xl py-6">
      <PageHeader
        title="My Profile"
        description="Manage your account settings and preferences"
      />
      
      <div className="mt-8 space-y-8">
        <Suspense fallback={<div>Loading profile...</div>}>
          <ProfileForm user={user} />
        </Suspense>
      </div>
      
      <Toaster />
    </main>
  );
} 