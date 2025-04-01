ALTER TABLE "reinforcements" DROP CONSTRAINT "reinforcements_session_id_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "activity_reinforcements" ADD COLUMN "reinforcement_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "reinforcements" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "activity_reinforcements" ADD CONSTRAINT "activity_reinforcements_reinforcement_id_reinforcements_id_fk" FOREIGN KEY ("reinforcement_id") REFERENCES "public"."reinforcements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reinforcements" ADD CONSTRAINT "reinforcements_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_reinforcements" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "activity_reinforcements" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "activity_reinforcements" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "reinforcements" DROP COLUMN "session_id";--> statement-breakpoint
ALTER TABLE "reinforcements" DROP COLUMN "frequency";--> statement-breakpoint
ALTER TABLE "reinforcements" DROP COLUMN "effectiveness";--> statement-breakpoint
ALTER TABLE "reinforcements" DROP COLUMN "notes";