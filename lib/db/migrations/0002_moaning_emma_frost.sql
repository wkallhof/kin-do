CREATE TABLE "focus_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"family_id" integer,
	"family_member_id" integer,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "family_members" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "family_members" ADD COLUMN "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "family_members" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "family_members" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "family_members" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "family_members" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "focus_areas" ADD CONSTRAINT "focus_areas_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "focus_areas" ADD CONSTRAINT "focus_areas_family_member_id_family_members_id_fk" FOREIGN KEY ("family_member_id") REFERENCES "public"."family_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_members" DROP COLUMN "preferences";--> statement-breakpoint
ALTER TABLE "family_members" DROP COLUMN "restrictions";--> statement-breakpoint
ALTER TABLE "family_members" DROP COLUMN "age_group";--> statement-breakpoint
ALTER TABLE "family_members" DROP COLUMN "relationship";