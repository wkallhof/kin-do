import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionInfo } from '../components/subscription-info';

export default async function SubscriptionPage() {
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

  // For demonstration - in a real app, we would fetch subscription data
  const subscriptionData = {
    status: 'active',
    plan: 'Premium',
    billingCycle: 'Monthly',
    nextBillingDate: '2023-08-01',
    amount: '$9.99',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            Manage your subscription plan and payment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionInfo user={user} subscription={subscriptionData} />
        </CardContent>
      </Card>
    </div>
  );
} 