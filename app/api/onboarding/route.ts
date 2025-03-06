import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users, families, familyMembers } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// Validation schema
const onboardingSchema = z.object({
  familyName: z.string().optional().default('My Family'),
  primaryGuardian: z.object({
    name: z.string(),
    role: z.enum(['primary_guardian', 'secondary_guardian']),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = onboardingSchema.parse(body);
    
    // Get the current user using their email
    const userEmail = session.user.email as string;
    
    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, userEmail)
    });
    
    if (!currentUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 400 }
      );
    }
    
    // Check if user already has a family member record
    const existingFamilyMember = await db.query.familyMembers.findFirst({
      where: eq(familyMembers.userId, currentUser.id)
    });
    
    if (existingFamilyMember) {
      return NextResponse.json(
        { 
          message: 'User already has a family set up',
          familyId: existingFamilyMember.familyId,
          familyMemberId: existingFamilyMember.id
        },
        { status: 200 }
      );
    }
    
    // Create a new family
    const newFamily = await db.insert(families).values({
      name: validatedData.familyName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    if (!newFamily || newFamily.length === 0) {
      return NextResponse.json(
        { message: 'Failed to create family' },
        { status: 500 }
      );
    }
    
    const familyId = newFamily[0].id;
    
    // Create a family member record for the user
    const newFamilyMember = await db.insert(familyMembers).values({
      familyId: familyId,
      userId: currentUser.id,
      name: validatedData.primaryGuardian.name || currentUser.name,
      role: validatedData.primaryGuardian.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return NextResponse.json({
      message: 'Onboarding completed successfully',
      familyId: familyId,
      familyMemberId: newFamilyMember[0].id
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error completing onboarding:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 