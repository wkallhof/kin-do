import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = updateProfileSchema.parse(json);

    // Check if email is already taken (if it's different from current email)
    if (body.email !== session.user.email) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, body.email),
      });

      if (existingUser) {
        return new NextResponse("Email already taken", { status: 400 });
      }
    }

    // Update user
    await db
      .update(users)
      .set({
        name: body.name,
        email: body.email,
        updatedAt: new Date(),
      })
      .where(eq(users.email, session.user.email));

    return new NextResponse("Profile updated successfully", { status: 200 });
  } catch (error) {
    console.error("[PROFILE_PATCH]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 