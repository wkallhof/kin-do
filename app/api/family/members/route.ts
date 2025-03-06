import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { familyMembers, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// Validation schema
const familyMemberSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required.',
  }),
  role: z.enum(['primary_guardian', 'secondary_guardian', 'child']),
  dateOfBirth: z.string().optional().nullable(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
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
    const validatedData = familyMemberSchema.parse(body);
    
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
    
    // Get current user's family member record
    const currentUserFamilyMember = await db.query.familyMembers.findFirst({
      where: eq(familyMembers.userId, currentUser.id)
    });
    
    if (!currentUserFamilyMember || !currentUserFamilyMember.familyId) {
      return NextResponse.json(
        { message: 'User does not have a family set up' },
        { status: 400 }
      );
    }
    
    // Create the new family member
    const newFamilyMember = await db.insert(familyMembers).values({
      familyId: currentUserFamilyMember.familyId,
      name: validatedData.name,
      role: validatedData.role,
      dateOfBirth: validatedData.dateOfBirth || null,
      bio: validatedData.bio || null,
      avatar: validatedData.avatar || null,
      // Set userId to null if this is not a user account (e.g., a child)
      userId: validatedData.role === 'child' ? null : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return NextResponse.json(newFamilyMember[0], { status: 201 });
  } catch (error) {
    console.error('Error creating family member:', error);
    
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