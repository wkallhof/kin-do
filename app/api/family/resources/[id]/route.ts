import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { resources, familyMembers, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

// Validation schema
const resourceUpdateSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required.',
  }),
  environment: z.enum(['indoor', 'outdoor']).optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    // Get the current user from the database
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { message: 'User email not found in session' },
        { status: 400 }
      );
    }
    
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
    
    // Get the resource ID from the URL
    const { id } = params;
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = resourceUpdateSchema.parse(body);
    
    // Check if the resource exists and belongs to the user's family
    const existingResource = await db.select()
      .from(resources)
      .where(
        and(
          eq(resources.id, parseInt(id)),
          eq(resources.familyId, currentUserFamilyMember.familyId)
        )
      )
      .limit(1);
    
    if (existingResource.length === 0) {
      return NextResponse.json(
        { message: 'Resource not found' },
        { status: 404 }
      );
    }
    
    // Update the resource
    const [updatedResource] = await db.update(resources)
      .set({
        name: validatedData.name,
        ...(validatedData.environment && { environment: validatedData.environment }),
        ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(resources.id, parseInt(id)),
          eq(resources.familyId, currentUserFamilyMember.familyId)
        )
      )
      .returning();
    
    return NextResponse.json(updatedResource);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    // Get the current user from the database
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { message: 'User email not found in session' },
        { status: 400 }
      );
    }
    
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
    
    // Get the resource ID from the URL
    const { id } = params;
    
    // Check if the resource exists and belongs to the user's family
    const existingResource = await db.select()
      .from(resources)
      .where(
        and(
          eq(resources.id, parseInt(id)),
          eq(resources.familyId, currentUserFamilyMember.familyId)
        )
      )
      .limit(1);
    
    if (existingResource.length === 0) {
      return NextResponse.json(
        { message: 'Resource not found' },
        { status: 404 }
      );
    }
    
    // Delete the resource
    await db.delete(resources)
      .where(
        and(
          eq(resources.id, parseInt(id)),
          eq(resources.familyId, currentUserFamilyMember.familyId)
        )
      );
    
    return NextResponse.json(
      { message: 'Resource deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 