import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, familyMembers, favoriteActivities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ACTIVITY_DATA_SCHEMA_VERSION } from "@/lib/db/schema/activities";

// GET /api/favorites - Get all favorites for the current user's family
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get user from email
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });
    
    if (!user?.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Get family member to find family ID
    const userFamilyMember = await db.query.familyMembers.findFirst({
      where: eq(familyMembers.userId, user.id),
    });
    
    if (!userFamilyMember?.familyId) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 });
    }
    
    // Get all favorites for this family
    const favorites = await db.query.favoriteActivities.findMany({
      where: eq(favoriteActivities.familyId, userFamilyMember.familyId),
      orderBy: (favoriteActivities, { desc }) => [desc(favoriteActivities.createdAt)],
    });
    
    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

// POST /api/favorites - Add a new favorite
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { activity } = body;
    
    if (!activity) {
      return NextResponse.json({ error: "Activity data is required" }, { status: 400 });
    }
    
    // Get user from email
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });
    
    if (!user?.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Get family member to find family ID
    const userFamilyMember = await db.query.familyMembers.findFirst({
      where: eq(familyMembers.userId, user.id),
    });
    
    if (!userFamilyMember?.familyId) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 });
    }
    
    // Prepare activity data with schema version
    const activityData = {
      ...activity,
      schemaVersion: ACTIVITY_DATA_SCHEMA_VERSION
    };
    
    // Insert the favorite
    const [favorite] = await db.insert(favoriteActivities)
      .values({
        familyId: userFamilyMember.familyId,
        activityData,
        lastUsedAt: new Date(),
      })
      .returning();
    
    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
} 