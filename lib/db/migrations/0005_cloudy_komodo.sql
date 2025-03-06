ALTER TABLE "favorite_activities" DROP CONSTRAINT "favorite_activities_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "favorite_activities" DROP COLUMN "location_id";--> statement-breakpoint
ALTER TABLE "favorite_activities" DROP COLUMN "use_count";