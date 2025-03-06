import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, families, familyMembers } from '../../lib/db/schema';
import { eq, like } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Initialize the database connection with explicit credentials from env
const queryClient = postgres(process.env.DATABASE_URL, {
  max: 1, // Limit connections for tests
  idle_timeout: 20,
  connect_timeout: 10,
});

const db = drizzle(queryClient);

export async function cleanupTestUser(email: string) {
  try {
    // Find the user
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (user) {
      // Delete family members
      await db.delete(familyMembers).where(eq(familyMembers.userId, user.id));
      
      // Find and delete family
      const [familyMember] = await db.select().from(familyMembers).where(eq(familyMembers.userId, user.id));
      if (familyMember?.familyId) {
        await db.delete(families).where(eq(families.id, familyMember.familyId));
      }
      
      // Delete the user
      await db.delete(users).where(eq(users.id, user.id));
    }
  } catch (error) {
    console.error('Error cleaning up test user:', error);
    throw error;
  }
}

export async function cleanupAllTestUsers() {
  try {
    // Delete all users with test- in their email
    const testUsers = await db.select().from(users).where(like(users.email, 'test-%'));
    
    for (const user of testUsers) {
      await cleanupTestUser(user.email);
    }
  } catch (error) {
    console.error('Error cleaning up all test users:', error);
    throw error;
  }
}

// Ensure we close the connection when tests are done
export async function closeConnection() {
  await queryClient.end();
} 