import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sessions } from "./session.table";

/**
 * Activity table schema for tracking activities performed during activity-based therapy sessions
 */
export const activities = pgTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  goal: varchar("goal", { length: 255 }),
  location: varchar("location", { length: 255 }),
  duration: integer("duration"), // in minutes
  completed: boolean("completed").default(false).notNull(),
  completionNotes: text("completion_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types for TypeScript type inference
export type Activity = typeof activities.$inferSelect;
export type ActivityInsert = typeof activities.$inferInsert;

// Zod schemas for validation
export const insertActivitySchema = createInsertSchema(activities, {
  sessionId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  goal: z.string().max(255).optional().nullable(),
  location: z.string().max(255).optional().nullable(),
  duration: z.number().int().positive().optional().nullable(),
  completed: z.boolean().default(false),
  completionNotes: z.string().optional().nullable(),
});

export const selectActivitySchema = createSelectSchema(activities, {
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  goal: z.string().nullable(),
  location: z.string().nullable(),
  duration: z.number().nullable(),
  completed: z.boolean(),
  completionNotes: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// Common activity categories for therapy sessions
export const ACTIVITY_CATEGORIES = [
  "Play-Based",
  "Academic",
  "Social Skills",
  "Fine Motor",
  "Gross Motor",
  "Self-Help",
  "Communication",
  "Sensory",
  "Art",
  "Music",
  "Outdoor",
  "Group",
  "Individual",
  "Structured",
  "Unstructured",
] as const;

// Common locations for activities
export const COMMON_LOCATIONS = [
  "Therapy Room",
  "Classroom",
  "Playground",
  "Home",
  "Kitchen",
  "Outdoors",
  "Gym",
  "Sensory Room",
  "Community Setting",
] as const;

/**
 * Helper function to format activity duration in human-readable format
 * @param minutes Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) {
    return "Unknown duration";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  return `${hours} hour${hours !== 1 ? "s" : ""} and ${remainingMinutes} minute${
    remainingMinutes !== 1 ? "s" : ""
  }`;
}

/**
 * Helper function to generate a summary of the activity
 * @param activity The activity to summarize
 * @returns Summary string
 */
export function generateActivitySummary(
  activity: Pick<Activity, "name" | "goal" | "duration" | "completed">,
): string {
  let summary = `Activity: ${activity.name}`;

  if (activity.goal) {
    summary += ` | Goal: ${activity.goal}`;
  }

  if (activity.duration) {
    summary += ` | Duration: ${formatDuration(activity.duration)}`;
  }

  summary += ` | Status: ${activity.completed ? "Completed" : "Not completed"}`;

  return summary;
}
