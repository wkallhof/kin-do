"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, families, familyMembers, generateInviteCode } from "@/lib/db/schema";
import { signIn } from "@/lib/auth";
import { eq, and, isNull } from "drizzle-orm";

// Define the schema for the onboarding data
const onboardingSchema = z.object({
  // Family data
  familyData: z.object({
    familyName: z.string().min(2, "Family name is required"),
    primaryGuardian: z.object({
      name: z.string().min(2, "Name is required"),
      role: z.enum(["primary_guardian", "secondary_guardian"]),
      dateOfBirth: z.date().optional(),
    }),
    additionalMembers: z.array(
      z.object({
        name: z.string().min(2, "Name is required"),
        role: z.string(),
        dateOfBirth: z.date().optional(),
      })
    ),
    inviteCode: z.string().optional(), // Add invite code field (optional for new families)
    familyMemberId: z.number().optional(), // ID of existing family member to associate with this account
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

// Function to find a family by invite code
export async function findFamilyByInviteCode(inviteCode: string) {
  try {
    const family = await db.select().from(families).where(eq(families.inviteCode, inviteCode));
    
    if (family && family.length > 0) {
      // Get family members
      const allMembers = await db.select().from(familyMembers)
        .where(eq(familyMembers.familyId, family[0].id));
      
      // Filter for eligible members (non-child roles without a userId)
      const eligibleMembers = allMembers.filter(member => 
        member.userId === null && 
        (member.role === 'primary_guardian' || 
         member.role === 'secondary_guardian' ||
         member.role === 'other_relative')
      );
      
      return { 
        success: true, 
        family: family[0],
        allMembers,
        eligibleMembers
      };
    }
    
    return { success: false, error: "Invalid invite code" };
  } catch (error) {
    console.error("Error finding family:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

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
    
    let familyId: number;
    
    // Check if we're joining an existing family using an invite code
    if (validatedData.familyData.inviteCode) {
      const existingFamily = await db.select().from(families)
        .where(eq(families.inviteCode, validatedData.familyData.inviteCode));
      
      if (!existingFamily || existingFamily.length === 0) {
        throw new Error("Invalid invite code");
      }
      
      familyId = existingFamily[0].id;
      
      if (validatedData.familyData.familyMemberId) {
        // User selected an existing family member to associate with their account
        const existingMember = await db.select().from(familyMembers)
          .where(and(
            eq(familyMembers.id, validatedData.familyData.familyMemberId),
            eq(familyMembers.familyId, familyId),
            isNull(familyMembers.userId)
          ));
        
        if (existingMember && existingMember.length > 0) {
          // Update existing member with user ID and date of birth
          await db.update(familyMembers)
            .set({ 
              userId, 
              name: validatedData.familyData.primaryGuardian.name, // Update name just in case
              // Convert Date object to ISO string date format for the database if it exists
              dateOfBirth: validatedData.familyData.primaryGuardian.dateOfBirth 
                ? validatedData.familyData.primaryGuardian.dateOfBirth.toISOString().split('T')[0] 
                : existingMember[0].dateOfBirth, // Keep existing value if no new value
              updatedAt: new Date() 
            })
            .where(eq(familyMembers.id, validatedData.familyData.familyMemberId));
        } else {
          throw new Error("Invalid family member selected");
        }
      } else {
        // Check if there's a matching member by name
        const existingMembers = await db.select().from(familyMembers)
          .where(eq(familyMembers.familyId, familyId));
        
        // Try to find a matching member by name to link with this user account
        const matchingMember = existingMembers.find(
          member => member.userId === null && 
          member.name.toLowerCase() === validatedData.familyData.primaryGuardian.name.toLowerCase()
        );
        
        if (matchingMember) {
          // Update existing member with user ID and possibly dateOfBirth
          await db.update(familyMembers)
            .set({ 
              userId,
              // Add dateOfBirth if provided in primaryGuardian
              dateOfBirth: validatedData.familyData.primaryGuardian.dateOfBirth 
                ? validatedData.familyData.primaryGuardian.dateOfBirth.toISOString().split('T')[0] 
                : matchingMember.dateOfBirth, // Keep existing value if no new value
              updatedAt: new Date() 
            })
            .where(eq(familyMembers.id, matchingMember.id));
        } else {
          // Create new family member for this user
          await db.insert(familyMembers).values({
            familyId,
            userId,
            name: validatedData.familyData.primaryGuardian.name,
            role: validatedData.familyData.primaryGuardian.role,
            // Convert Date object to ISO string date format for the database if it exists
            dateOfBirth: validatedData.familyData.primaryGuardian.dateOfBirth 
              ? validatedData.familyData.primaryGuardian.dateOfBirth.toISOString().split('T')[0]
              : null,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    } else {
      // 2. Create the family with the provided family name and a new invite code
      const newFamily = await db.insert(families).values({
        name: validatedData.familyData.familyName,
        inviteCode: generateInviteCode(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      
      if (!newFamily || newFamily.length === 0) {
        throw new Error("Failed to create family");
      }
      
      familyId = newFamily[0].id;
      
      // 3. Create the primary guardian family member
      await db.insert(familyMembers).values({
        familyId: familyId,
        userId: userId,
        name: validatedData.familyData.primaryGuardian.name,
        role: validatedData.familyData.primaryGuardian.role,
        // Convert Date object to ISO string date format for the database if it exists
        dateOfBirth: validatedData.familyData.primaryGuardian.dateOfBirth 
          ? validatedData.familyData.primaryGuardian.dateOfBirth.toISOString().split('T')[0]
          : null,
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