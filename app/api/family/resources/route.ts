import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { resources, familyMembers, users } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

// Validation schema
const resourceCreateSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required.',
  }),
  environment: z.enum(['indoor', 'outdoor']),
});

export async function GET(request: NextRequest) {
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
    
    // Get environment filter from query params
    const { searchParams } = new URL(request.url);
    const environment = searchParams.get('environment');
    
    // Build query conditions
    if (environment && (environment === 'indoor' || environment === 'outdoor')) {
      // If environment filter is provided
      const resourcesList = await db.select()
        .from(resources)
        .where(
          and(
            eq(resources.familyId, currentUserFamilyMember.familyId),
            eq(resources.environment, environment)
          )
        );
      
      return NextResponse.json(resourcesList);
    } else {
      // If no environment filter
      const resourcesList = await db.select()
        .from(resources)
        .where(eq(resources.familyId, currentUserFamilyMember.familyId));
      
      return NextResponse.json(resourcesList);
    }
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = resourceCreateSchema.parse(body);
    
    // Create the resource
    const [newResource] = await db.insert(resources).values({
      familyId: currentUserFamilyMember.familyId,
      name: validatedData.name,
      environment: validatedData.environment,
    }).returning();
    
    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 