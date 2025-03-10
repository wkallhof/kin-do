import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SupportForm } from '../components/support-form';

export default async function SupportPage() {
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
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Get help with any issues or questions you have about Kin•Do
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupportForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
} 