CREATE TYPE "public"."note_category" AS ENUM('general', 'observation', 'progress', 'behavioral', 'communication', 'medical', 'environmental', 'caregiver', 'other');--> statement-breakpoint
CREATE TYPE "public"."mastery_level" AS ENUM('not_introduced', 'emerging', 'developing', 'mastered', 'generalized');--> statement-breakpoint
CREATE TYPE "public"."prompt_level" AS ENUM('Independent', 'Verbal', 'Gestural', 'Model', 'Partial Physical', 'Full Physical');--> statement-breakpoint
CREATE TYPE "public"."reinforcement_effectiveness" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."reinforcement_type" AS ENUM('primary', 'secondary', 'social', 'token', 'activity', 'other');--> statement-breakpoint
CREATE TYPE "public"."attention_level" AS ENUM('focused', 'easily_redirectable', 'moderate_redirection', 'difficult_redirection', 'unable_to_redirect');--> statement-breakpoint
CREATE TYPE "public"."intensity_level" AS ENUM('1 - mild', '2 - moderate', '3 - significant', '4 - severe', '5 - extreme');--> statement-breakpoint
CREATE TYPE "public"."mood" AS ENUM('happy', 'calm', 'sad', 'angry', 'anxious', 'tired', 'energetic', 'frustrated', 'neutral');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('draft', 'submitted', 'reviewed');--> statement-breakpoint
CREATE TABLE "activity_behaviors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"behavior_name" varchar(255) NOT NULL,
	"definition" text,
	"intensity" "intensity_level",
	"intervention_used" text,
	"intervention_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"prompt_type" "prompt_level" NOT NULL,
	"frequency" integer DEFAULT 0,
	"target_skill" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_reinforcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "reinforcement_type" NOT NULL,
	"description" text,
	"frequency" integer DEFAULT 0,
	"effectiveness" "reinforcement_effectiveness",
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"goal" varchar(255),
	"location" varchar(255),
	"duration" integer,
	"completed" boolean DEFAULT false NOT NULL,
	"completion_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "behavior_trackings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"behavior_name" varchar(255) NOT NULL,
	"definition" text,
	"antecedent" text,
	"consequence" text,
	"frequency" integer DEFAULT 0,
	"duration" integer,
	"intensity" "intensity_level",
	"notes" text,
	"intervention_used" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"address" text,
	"notes" text,
	"organization_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "general_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"title" varchar(255),
	"content" text NOT NULL,
	"category" "note_category" DEFAULT 'general',
	"important" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"logo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"full_name" varchar(255),
	"avatar_url" text,
	"auth_provider" varchar(50),
	"auth_provider_id" varchar(255),
	"password_hash" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_email_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "organization_users" (
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organization_users_organization_id_user_id_pk" PRIMARY KEY("organization_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_clients" (
	"user_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_clients_user_id_client_id_pk" PRIMARY KEY("user_id","client_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"session_date" timestamp NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"location" varchar(255) NOT NULL,
	"is_activity_based" boolean DEFAULT false NOT NULL,
	"status" "session_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"summary" text,
	"full_content" text NOT NULL,
	"status" "session_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_trackings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"target" varchar(255) NOT NULL,
	"program" varchar(255) NOT NULL,
	"prompt_level" "prompt_level",
	"trials" integer DEFAULT 0 NOT NULL,
	"mastery" integer DEFAULT 0 NOT NULL,
	"correct" integer DEFAULT 0 NOT NULL,
	"prompted" integer DEFAULT 0 NOT NULL,
	"incorrect" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"skill_name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"mastery_level" "mastery_level" DEFAULT 'not_introduced'
);
--> statement-breakpoint
CREATE TABLE "reinforcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "reinforcement_type" NOT NULL,
	"description" text,
	"frequency" integer DEFAULT 0,
	"effectiveness" "reinforcement_effectiveness",
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "initial_statuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"mood" "mood",
	"attention" "attention_level",
	"context_notes" text,
	"physical_state" text,
	"session_readiness" text,
	"caregiver_report" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "initial_statuses_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
ALTER TABLE "activity_behaviors" ADD CONSTRAINT "activity_behaviors_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_prompts" ADD CONSTRAINT "activity_prompts_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_reinforcements" ADD CONSTRAINT "activity_reinforcements_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "behavior_trackings" ADD CONSTRAINT "behavior_trackings_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "general_notes" ADD CONSTRAINT "general_notes_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_clients" ADD CONSTRAINT "user_clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_clients" ADD CONSTRAINT "user_clients_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_sections" ADD CONSTRAINT "report_sections_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_trackings" ADD CONSTRAINT "skill_trackings_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reinforcements" ADD CONSTRAINT "reinforcements_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "initial_statuses" ADD CONSTRAINT "initial_statuses_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;