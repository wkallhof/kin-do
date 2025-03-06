import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, familyMembers, favoriteActivities } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// DELETE /api/favorites/[id] - Remove a favorite
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const favoriteId = parseInt(params.id);
    
    if (isNaN(favoriteId)) {
      return NextResponse.json({ error: "Invalid favorite ID" }, { status: 400 });
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
    
    // Verify the favorite belongs to this family before deleting
    const favorite = await db.query.favoriteActivities.findFirst({
      where: and(
        eq(favoriteActivities.id, favoriteId),
        eq(favoriteActivities.familyId, userFamilyMember.familyId)
      ),
    });
    
    if (!favorite) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
    }
    
    // Delete the favorite
    await db.delete(favoriteActivities)
      .where(eq(favoriteActivities.id, favoriteId));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json({ error: "Failed to delete favorite" }, { status: 500 });
  }
} 