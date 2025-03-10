import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationsForm } from '../components/notifications-form';

export default async function NotificationsPage() {
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Manage how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationsForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
} 