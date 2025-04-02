CREATE TABLE "activity_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"prompt_level" "prompt_level",
	"trials" integer DEFAULT 0 NOT NULL,
	"mastery" integer DEFAULT 0 NOT NULL,
	"correct" integer DEFAULT 0 NOT NULL,
	"prompted" integer DEFAULT 0 NOT NULL,
	"incorrect" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"target" varchar(255) NOT NULL,
	"program" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "behavior_trackings" CASCADE;--> statement-breakpoint
DROP TABLE "skill_trackings" CASCADE;--> statement-breakpoint
ALTER TABLE "activity_skills" ADD CONSTRAINT "activity_skills_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_skills" ADD CONSTRAINT "activity_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_behaviors" DROP COLUMN "behavior_name";--> statement-breakpoint
ALTER TABLE "activity_behaviors" DROP COLUMN "definition";