import { pgTable, serial, text, timestamp, integer, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { resources } from './resources';

export const families = pgTable('families', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const familyMembers = pgTable('family_members', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').references(() => families.id),
  userId: integer('user_id').references(() => users.id), // null for non-user family members (e.g. children)
  name: text('name').notNull(),
  role: text('role').notNull(), // 'primary_guardian', 'secondary_guardian', 'child'
  dateOfBirth: date('date_of_birth'), // Replacing ageGroup with actual date of birth
  bio: text('bio'), // Added bio field for description, interests, etc.
  avatar: text('avatar'), // URL to avatar image
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const familyRelations = relations(families, ({ many }) => ({
  members: many(familyMembers),
  resources: many(resources),
}));

export const familyMemberRelations = relations(familyMembers, ({ one }) => ({
  family: one(families, {
    fields: [familyMembers.familyId],
    references: [families.id],
  }),
  user: one(users, {
    fields: [familyMembers.userId],
    references: [users.id],
  }),
  // Will be connected in focus-areas.ts to avoid circular dependencies
  // focusAreas: many(focusAreas)
})); 