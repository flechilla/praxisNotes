import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { sessions } from "./session.table";
import {
  intensityLevelEnum,
  INTENSITY_LEVEL_VALUES,
} from "../enums/intensity-level.enum";

/**
 * Behavior tracking table schema definition
 * Represents behaviors tracked during therapy sessions
 */
export const behaviorTrackings = pgTable("behavior_trackings", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  behaviorName: varchar("behavior_name", { length: 255 }).notNull(),
  definition: text("definition"),
  antecedent: text("antecedent"),
  consequence: text("consequence"),
  frequency: integer("frequency").default(0),
  duration: integer("duration"), // in seconds
  intensity: intensityLevelEnum("intensity"),
  notes: text("notes"),
  interventionUsed: text("intervention_used"), // stored as JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define behavior tracking relations
 */
export const behaviorTrackingsRelations = relations(
  behaviorTrackings,
  ({ one }) => ({
    session: one(sessions, {
      fields: [behaviorTrackings.sessionId],
      references: [sessions.id],
    }),
  }),
);

// Types derived from the schema
export type BehaviorTracking = typeof behaviorTrackings.$inferSelect;
export type BehaviorTrackingInsert = typeof behaviorTrackings.$inferInsert;

// Zod schemas for validation
export const insertBehaviorTrackingSchema = createInsertSchema(
  behaviorTrackings,
  {
    sessionId: z.string().uuid(),
    behaviorName: z.string().min(1).max(255),
    definition: z.string().optional().nullable(),
    antecedent: z.string().optional().nullable(),
    consequence: z.string().optional().nullable(),
    frequency: z.number().int().nonnegative().optional(),
    duration: z.number().int().nonnegative().optional().nullable(), // in seconds
    intensity: z
      .enum(INTENSITY_LEVEL_VALUES as [string, ...string[]])
      .optional()
      .nullable(),
    notes: z.string().optional().nullable(),
    interventionUsed: z.string().optional().nullable(), // JSON string validation
  },
).omit({ id: true, createdAt: true, updatedAt: true });

export const selectBehaviorTrackingSchema =
  createSelectSchema(behaviorTrackings);

// Common intervention types
export const INTERVENTION_TYPES = [
  "Redirection",
  "Response Blocking",
  "Planned Ignoring",
  "Verbal Prompt",
  "Visual Support",
  "Token Economy",
  "Reinforcement of Alternative Behavior",
  "Environmental Modification",
  "Self-Regulation Strategy",
  "Social Story",
] as const;

/**
 * Helper function to format duration in human-readable format
 * @param seconds Duration in seconds
 * @returns Formatted duration string (e.g., "1 minute 30 seconds")
 */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) {
    return "Not recorded";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }

  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  return `${minutes} minute${
    minutes !== 1 ? "s" : ""
  } and ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
}
