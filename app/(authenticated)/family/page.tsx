import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { eq, and, isNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, familyMembers, focusAreas } from '@/lib/db/schema';
import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FamilyMemberList } from './components/FamilyMemberList';
import { FocusAreaList } from './components/FocusAreaList';
import { PageHeader } from '@/app/(authenticated)/components/page-header';

export const metadata: Metadata = {
  title: 'Family | Kin•Do',
  description: 'Manage your family in Kin•Do',
};

export default async function FamilyPage() {
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
    // User doesn't have a family yet
    return (
      <main className="container py-6">
        <PageHeader
          title="Family"
          description="Manage your family members and their focus areas"
        />
        <FamilyMemberList members={[]} />
      </main>
    );
  }
  
  // Get all family members for this family, including those with null userId (children)
  const members = await db.query.familyMembers.findMany({
    where: eq(familyMembers.familyId, userFamilyMember.familyId),
    orderBy: (familyMembers, { asc }) => [asc(familyMembers.role), asc(familyMembers.name)],
  });

  // Get focus areas for each family member
  const membersWithFocusAreas = await Promise.all(
    members.map(async (member) => {
      const memberFocusAreas = await db.query.focusAreas.findMany({
        where: eq(focusAreas.familyMemberId, member.id)
      });
      
      return {
        ...member,
        dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : null,
        focusAreas: memberFocusAreas
      };
    })
  );

  // Get family-wide focus areas
  const familyFocusAreas = await db.query.focusAreas.findMany({
    where: and(
      eq(focusAreas.familyId, userFamilyMember.familyId),
      isNull(focusAreas.familyMemberId)
    ),
  });

  return (
    <main className="container py-6">
      <PageHeader
        title="My Family"
        description="Manage your family members and their focus areas"
      />
      
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="members">Family Members</TabsTrigger>
          <TabsTrigger value="focus-areas">Family Focus Areas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <Suspense fallback={<p>Loading family members...</p>}>
            <FamilyMemberList members={membersWithFocusAreas} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="focus-areas">
            <Suspense fallback={<p>Loading focus areas...</p>}>
                <FocusAreaList 
                    familyId={userFamilyMember.familyId} 
                    focusAreas={familyFocusAreas}
                    vertical={true}
                />
            </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  );
} 