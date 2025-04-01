import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { activities } from "./activity.table";
import { intensityLevelEnum } from "./behavior_tracking.table";

/**
 * Activity behavior table schema for tracking behaviors observed during specific activities
 */
export const activityBehaviors = pgTable("activity_behaviors", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activities.id, { onDelete: "cascade" })
    .notNull(),
  behaviorName: varchar("behavior_name", { length: 255 }).notNull(),
  definition: text("definition"),
  intensity: intensityLevelEnum("intensity"),
  interventionUsed: text("intervention_used"), // stored as JSON string
  interventionNotes: text("intervention_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types for TypeScript type inference
export type ActivityBehavior = typeof activityBehaviors.$inferSelect;
export type ActivityBehaviorInsert = typeof activityBehaviors.$inferInsert;

// Zod schemas for validation
export const insertActivityBehaviorSchema = createInsertSchema(
  activityBehaviors,
  {
    activityId: z.string().uuid(),
    behaviorName: z.string().min(1).max(255),
    definition: z.string().optional().nullable(),
    intensity: z
      .enum([
        "1 - mild",
        "2 - moderate",
        "3 - significant",
        "4 - severe",
        "5 - extreme",
      ])
      .optional()
      .nullable(),
    interventionUsed: z.string().optional().nullable(), // JSON string validation
    interventionNotes: z.string().optional().nullable(),
  },
);

export const selectActivityBehaviorSchema = createSelectSchema(
  activityBehaviors,
  {
    id: z.string().uuid(),
    activityId: z.string().uuid(),
    behaviorName: z.string(),
    definition: z.string().nullable(),
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

/**
 * Helper function to generate a brief summary of the behavior and intervention
 * @param activityBehavior The activity behavior record
 * @returns Formatted summary string
 */
export function summarizeBehaviorIntervention(
  activityBehavior: Pick<
    ActivityBehavior,
    "behaviorName" | "intensity" | "interventionUsed"
  >,
): string {
  let summary = `Behavior: ${activityBehavior.behaviorName}`;

  if (activityBehavior.intensity) {
    summary += ` | Intensity: ${activityBehavior.intensity}`;
  }

  if (activityBehavior.interventionUsed) {
    const interventions = parseInterventions(activityBehavior.interventionUsed);
    if (interventions.length) {
      summary += ` | Interventions: ${formatInterventions(interventions)}`;
    }
  }

  return summary;
}
