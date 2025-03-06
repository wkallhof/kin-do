import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { focusAreas, familyMembers, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// Validation schema
const focusAreaUpdateSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required.',
  }),
  description: z.string().optional(),
  category: z.enum(['physical', 'educational', 'creative', 'social', 'life_skills']),
  priority: z.number().min(1).max(5),
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
    const validatedData = focusAreaUpdateSchema.parse(body);
    
    // Get the focus area ID from the URL - properly await params
    const { id } = await params;
    const focusAreaId = parseInt(id);
    
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
    
    // Find the focus area to update
    const focusArea = await db.query.focusAreas.findFirst({
      where: eq(focusAreas.id, focusAreaId)
    });
    
    if (!focusArea) {
      return NextResponse.json(
        { message: 'Focus area not found' },
        { status: 404 }
      );
    }
    
    // Verify the focus area belongs to the user's family
    if (focusArea.familyId !== currentUserFamilyMember.familyId) {
      return NextResponse.json(
        { message: 'Unauthorized - focus area belongs to a different family' },
        { status: 403 }
      );
    }
    
    // Update the focus area
    const updatedFocusArea = await db.update(focusAreas)
      .set({
        title: validatedData.title,
        description: validatedData.description || null,
        category: validatedData.category,
        priority: validatedData.priority,
        updatedAt: new Date(),
      })
      .where(eq(focusAreas.id, focusAreaId))
      .returning();
    
    if (!updatedFocusArea || updatedFocusArea.length === 0) {
      return NextResponse.json(
        { message: 'Failed to update focus area' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedFocusArea[0]);
  } catch (error) {
    console.error('Error updating focus area:', error);
    
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
    
    // Get the focus area ID from the URL - properly await params
    const { id } = await params;
    const focusAreaId = parseInt(id);
    
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
    
    // Find the focus area to delete
    const focusArea = await db.query.focusAreas.findFirst({
      where: eq(focusAreas.id, focusAreaId)
    });
    
    if (!focusArea) {
      return NextResponse.json(
        { message: 'Focus area not found' },
        { status: 404 }
      );
    }
    
    // Verify the focus area belongs to the user's family
    if (focusArea.familyId !== currentUserFamilyMember.familyId) {
      return NextResponse.json(
        { message: 'Unauthorized - focus area belongs to a different family' },
        { status: 403 }
      );
    }
    
    // Delete the focus area
    await db.delete(focusAreas)
      .where(eq(focusAreas.id, focusAreaId));
    
    return NextResponse.json(
      { message: 'Focus area deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting focus area:', error);
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 