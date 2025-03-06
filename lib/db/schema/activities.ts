import { pgTable, serial, text, timestamp, integer, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { families } from './families';

// Favorite/saved activities
export const favoriteActivities = pgTable('favorite_activities', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').references(() => families.id),
  activityData: json('activity_data').$type<ActivityData>(),
  createdAt: timestamp('created_at').defaultNow(),
  lastUsedAt: timestamp('last_used_at'),
  notes: text('notes'), // User added tips/notes
});

// Define relations for favoriteActivities
export const favoriteActivitiesRelations = relations(favoriteActivities, ({ one }) => ({
  family: one(families, {
    fields: [favoriteActivities.familyId],
    references: [families.id],
  }),
})); 

export interface ActivityData {
  schemaVersion: number;
  title: string;
  description: string;
  instructions: string;
}

// Current schema versions
export const ACTIVITY_DATA_SCHEMA_VERSION = 1; 