import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { activities } from "./activity.table";
import {
  intensityLevelEnum,
  INTENSITY_LEVEL_VALUES,
} from "../enums/intensity-level.enum";

/**
 * Activity behavior table schema for tracking behaviors observed during specific activities
 */
export const activityBehaviors = pgTable("activity_behaviors", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activities.id, { onDelete: "cascade" })
    .notNull(),
  intensity: intensityLevelEnum("intensity"),
  interventionUsed: text("intervention_used"), // stored as JSON string
  interventionNotes: text("intervention_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define activity behavior relations
 */
export const activityBehaviorsRelations = relations(
  activityBehaviors,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityBehaviors.activityId],
      references: [activities.id],
    }),
  }),
);

// Types for TypeScript type inference
export type ActivityBehavior = typeof activityBehaviors.$inferSelect;
export type ActivityBehaviorInsert = typeof activityBehaviors.$inferInsert;

// Zod schemas for validation
export const insertActivityBehaviorSchema = createInsertSchema(
  activityBehaviors,
  {
    activityId: z.string().uuid(),
    intensity: z
      .enum(INTENSITY_LEVEL_VALUES as [string, ...string[]])
      .optional()
      .nullable(),
    interventionUsed: z.string().optional().nullable(), // JSON string validation
    interventionNotes: z.string().optional().nullable(),
  },
).omit({ id: true, createdAt: true, updatedAt: true });

export const selectActivityBehaviorSchema = createSelectSchema(
  activityBehaviors,
  {
    id: z.string().uuid(),
    activityId: z.string().uuid(),
    intensity: z.string().nullable(),
    interventionUsed: z.string().nullable(),
    interventionNotes: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  },
);

// Common intervention types (same as in behavior_tracking)
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
 * Helper function to parse JSON intervention data
 * @param jsonString JSON string containing intervention data
 * @returns Parsed intervention array or empty array if invalid
 */
export function parseInterventions(
  jsonString: string | null | undefined,
): string[] {
  if (!jsonString) {
    return [];
  }

  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error parsing intervention JSON:", e);
    return [];
  }
}

/**
 * Helper function to format intervention array as a readable string
 * @param interventions Array of intervention names
 * @returns Formatted string of interventions
 */
export function formatInterventions(interventions: string[]): string {
  if (!interventions.length) {
    return "No interventions recorded";
  }

  return interventions.join(", ");
}
