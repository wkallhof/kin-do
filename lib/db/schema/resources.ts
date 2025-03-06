import { pgTable, serial, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { families } from './families';

// Create an enum for environment types
export const environmentEnum = pgEnum('environment_type', ['indoor', 'outdoor']);

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').references(() => families.id),
  name: text('name').notNull(),
  environment: environmentEnum('environment').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const resourceRelations = relations(resources, ({ one }) => ({
  family: one(families, {
    fields: [resources.familyId],
    references: [families.id],
  }),
})); 