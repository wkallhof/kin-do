"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, families, familyMembers } from "@/lib/db/schema";
import { signIn } from "@/lib/auth";

// Define the schema for the onboarding data
const onboardingSchema = z.object({
  // Family data
  familyData: z.object({
    familyName: z.string().min(2, "Family name is required"),
    primaryGuardian: z.object({
      name: z.string().min(2, "Name is required"),
      role: z.enum(["primary_guardian", "secondary_guardian"]),
    }),
    additionalMembers: z.array(
      z.object({
        name: z.string().min(2, "Name is required"),
        role: z.string(),
        dateOfBirth: z.date().optional(),
      })
    ),
  }),
  // Location data
  locationData: z.object({
    home: z.object({
      name: z.string(),
      type: z.literal("home"),
      availableThings: z.record(z.boolean()),
    }),
  }),
  // Account data
  accountData: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

export async function completeRegistration(data: OnboardingData) {
  try {
    // Validate the data
    const validatedData = onboardingSchema.parse(data);
    
    // 1. Create the user account
    const hashedPassword = await bcrypt.hash(validatedData.accountData.password, 10);
    
    const newUser = await db.insert(users).values({
      name: validatedData.familyData.primaryGuardian.name,
      email: validatedData.accountData.email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    if (!newUser || newUser.length === 0) {
      throw new Error("Failed to create user");
    }
    
    const userId = newUser[0].id;
    
    // 2. Create the family with the provided family name
    const newFamily = await db.insert(families).values({
      name: validatedData.familyData.familyName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    if (!newFamily || newFamily.length === 0) {
      throw new Error("Failed to create family");
    }
    
    const familyId = newFamily[0].id;
    
    // 3. Create the primary guardian family member
    await db.insert(familyMembers).values({
      familyId: familyId,
      userId: userId,
      name: validatedData.familyData.primaryGuardian.name,
      role: validatedData.familyData.primaryGuardian.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // 4. Create additional family members if any
    if (validatedData.familyData.additionalMembers.length > 0) {
      const additionalMembersData = validatedData.familyData.additionalMembers.map(member => ({
        familyId: familyId,
        userId: null, // Additional members don't have user accounts
        name: member.name,
        role: member.role,
        // Convert Date object to ISO string date format for the database
        dateOfBirth: member.dateOfBirth ? member.dateOfBirth.toISOString().split('T')[0] : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      
      await db.insert(familyMembers).values(additionalMembersData);
    }
    
    // 5. Sign in the user
    await signIn("credentials", {
      email: validatedData.accountData.email,
      password: validatedData.accountData.password,
      redirect: false,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
} 