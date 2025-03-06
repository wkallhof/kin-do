import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { focusAreas, familyMembers, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// Validation schema
const focusAreaSchema = z.object({
  familyMemberId: z.number().optional(),
  familyId: z.number().optional(),
  title: z.string().min(1, {
    message: 'Title is required.',
  }),
  description: z.string().optional(),
  category: z.enum(['physical', 'educational', 'creative', 'social', 'life_skills']),
  priority: z.number().min(1).max(5).default(1),
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
    const validatedData = focusAreaSchema.parse(body);
    
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
    
    // If familyMemberId is provided, verify the target family member belongs to the same family
    if (validatedData.familyMemberId) {
      const targetFamilyMember = await db.query.familyMembers.findFirst({
        where: eq(familyMembers.id, validatedData.familyMemberId)
      });
      
      if (!targetFamilyMember) {
        return NextResponse.json(
          { message: 'Target family member not found' },
          { status: 404 }
        );
      }
      
      if (targetFamilyMember.familyId !== currentUserFamilyMember.familyId) {
        return NextResponse.json(
          { message: 'Unauthorized - family member belongs to a different family' },
          { status: 403 }
        );
      }
    }
    
    // Create the new focus area
    const newFocusArea = await db.insert(focusAreas).values({
      familyId: currentUserFamilyMember.familyId,
      familyMemberId: validatedData.familyMemberId || null,
      title: validatedData.title,
      description: validatedData.description || null,
      category: validatedData.category,
      priority: validatedData.priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return NextResponse.json(newFocusArea[0], { status: 201 });
  } catch (error) {
    console.error('Error creating focus area:', error);
    
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