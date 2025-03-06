import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { families, familyMembers } from './families';

export const focusAreas = pgTable('focus_areas', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').references(() => families.id),
  familyMemberId: integer('family_member_id').references(() => familyMembers.id, { onDelete: 'cascade' }), // null for family-wide focus areas
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(), // 'physical', 'educational', 'creative', 'social', 'life_skills'
  priority: integer('priority').default(1), // 1-5, higher means more weight in activity generation
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const focusAreaRelations = relations(focusAreas, ({ one }) => ({
  family: one(families, {
    fields: [focusAreas.familyId],
    references: [families.id],
  }),
  familyMember: one(familyMembers, {
    fields: [focusAreas.familyMemberId],
    references: [familyMembers.id],
  }),
}));

// Export types
export type FocusArea = typeof focusAreas.$inferSelect;
export type NewFocusArea = typeof focusAreas.$inferInsert; 