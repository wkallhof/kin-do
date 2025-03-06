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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    // Get the family member ID from the URL - await the params
    const { id } = await params;
    const familyMemberId = parseInt(id);
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
    
    // Get current user's family member record to verify they belong to the same family
    const currentUserFamilyMember = await db.query.familyMembers.findFirst({
      where: eq(familyMembers.userId, currentUser.id)
    });
    
    if (!currentUserFamilyMember || !currentUserFamilyMember.familyId) {
      return NextResponse.json(
        { message: 'User does not have a family set up' },
        { status: 400 }
      );
    }
    
    // Find the family member to update
    const targetFamilyMember = await db.query.familyMembers.findFirst({
      where: eq(familyMembers.id, familyMemberId)
    });
    
    if (!targetFamilyMember) {
      return NextResponse.json(
        { message: 'Family member not found' },
        { status: 404 }
      );
    }
    
    // Verify the family member belongs to the same family as the user
    if (targetFamilyMember.familyId !== currentUserFamilyMember.familyId) {
      return NextResponse.json(
        { message: 'Unauthorized - family member belongs to a different family' },
        { status: 403 }
      );
    }
    
    // Update the family member
    const updatedFamilyMember = await db.update(familyMembers)
      .set({
        name: validatedData.name,
        role: validatedData.role,
        dateOfBirth: validatedData.dateOfBirth || null,
        bio: validatedData.bio || null,
        avatar: validatedData.avatar || null,
        updatedAt: new Date(),
      })
      .where(eq(familyMembers.id, familyMemberId))
      .returning();
    
    if (!updatedFamilyMember || updatedFamilyMember.length === 0) {
      return NextResponse.json(
        { message: 'Failed to update family member' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedFamilyMember[0]);
  } catch (error) {
    console.error('Error updating family member:', error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Get the family member ID from the URL
    const familyMemberId = parseInt(id);
    
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
    
    // Get current user's family member record to verify they belong to the same family
    const currentUserFamilyMember = await db.query.familyMembers.findFirst({
      where: eq(familyMembers.userId, currentUser.id)
    });
    
    if (!currentUserFamilyMember || !currentUserFamilyMember.familyId) {
      return NextResponse.json(
        { message: 'User does not have a family set up' },
        { status: 400 }
      );
    }
    
    // Find the family member to delete
    const targetFamilyMember = await db.query.familyMembers.findFirst({
      where: eq(familyMembers.id, familyMemberId)
    });
    
    if (!targetFamilyMember) {
      return NextResponse.json(
        { message: 'Family member not found' },
        { status: 404 }
      );
    }
    
    // Verify the family member belongs to the same family as the user
    if (targetFamilyMember.familyId !== currentUserFamilyMember.familyId) {
      return NextResponse.json(
        { message: 'Unauthorized - family member belongs to a different family' },
        { status: 403 }
      );
    }
    
    // Prevent deleting yourself (primary guardian)
    if (targetFamilyMember.id === currentUserFamilyMember.id) {
      return NextResponse.json(
        { message: 'Cannot delete yourself - you are the primary guardian' },
        { status: 400 }
      );
    }
    
    // Delete the family member
    await db.delete(familyMembers)
      .where(eq(familyMembers.id, familyMemberId));
    
    return NextResponse.json(
      { message: 'Family member deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting family member:', error);
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 