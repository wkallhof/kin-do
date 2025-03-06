ALTER TABLE "focus_areas" DROP CONSTRAINT "focus_areas_family_member_id_family_members_id_fk";
--> statement-breakpoint
ALTER TABLE "focus_areas" ADD CONSTRAINT "focus_areas_family_member_id_family_members_id_fk" FOREIGN KEY ("family_member_id") REFERENCES "public"."family_members"("id") ON DELETE cascade ON UPDATE no action;