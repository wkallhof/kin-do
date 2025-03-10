import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, familyMembers, focusAreas, resources } from '@/lib/db/schema';
import { PageHeader } from '../components/page-header';
import { Toaster } from 'sonner';
import { ClientActivitiesPage } from './components/ClientActivitiesPage';

export default async function ActivitiesPage() {
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
  
  // First, find the user's family member record to get the familyId
  const userFamilyMember = await db.query.familyMembers.findFirst({
    where: eq(familyMembers.userId, user.id),
  });
  
  if (!userFamilyMember?.familyId) {
    return (
      <main className="container py-6">
        <h1 className="text-2xl font-bold">Activities</h1>
        <p>You need to set up your family before you can generate activities.</p>
      </main>
    );
  }

  // Get all family members for this family
  const members = await db.query.familyMembers.findMany({
    where: eq(familyMembers.familyId, userFamilyMember.familyId),
    orderBy: (familyMembers, { asc }) => [asc(familyMembers.role), asc(familyMembers.name)],
  });

  // Get all focus areas for this family (both family-wide and member-specific)
  const familyFocusAreas = await db.query.focusAreas.findMany({
    where: eq(focusAreas.familyId, userFamilyMember.familyId),
    with: {
      familyMember: true
    }
  }).then(areas => areas.map(area => ({
    ...area,
    familyMemberName: area.familyMember?.name ?? null
  })));

  // Get all resources for this family
  const familyResources = await db.query.resources.findMany({
    where: eq(resources.familyId, userFamilyMember.familyId),
  });

  return (
    <main className="container py-6">

      <PageHeader
        title="Today's Activities"
        description="Get the latest activities for your family"
      />

      <ClientActivitiesPage
        familyMembers={members}
        focusAreas={familyFocusAreas}
        resources={familyResources}
      />
      
      <Toaster />
    </main>
  );
} 