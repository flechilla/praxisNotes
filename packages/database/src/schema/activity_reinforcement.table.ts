import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { activities } from "./activity.table";
import {
  reinforcementTypeEnum,
  effectivenessLevelEnum,
} from "./reinforcement.table";

/**
 * Activity reinforcement table schema for tracking reinforcements used during specific activities
 */
export const activityReinforcements = pgTable("activity_reinforcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activities.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  type: reinforcementTypeEnum("type").notNull(),
  effectiveness: effectivenessLevelEnum("effectiveness"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types for TypeScript type inference
export type ActivityReinforcement = typeof activityReinforcements.$inferSelect;
export type ActivityReinforcementInsert =
  typeof activityReinforcements.$inferInsert;

// Zod schemas for validation
export const insertActivityReinforcementSchema = createInsertSchema(
  activityReinforcements,
  {
    activityId: z.string().uuid(),
    name: z.string().min(1),
    type: z.enum([
      "Token Economy",
      "Social Praise",
      "Tangible Item",
      "Preferred Activity",
      "Break",
      "Edible",
      "Natural Consequence",
      "Preferred Toy",
      "Primary Reinforcer",
      "Secondary Reinforcer",
    ]),
    effectiveness: z
      .enum(["High", "Medium", "Low", "Variable", "Not Effective"])
      .optional()
      .nullable(),
    notes: z.string().optional().nullable(),
  },
);

export const selectActivityReinforcementSchema = createSelectSchema(
  activityReinforcements,
);

/**
 * Interface defining properties for creating reinforcement recommendations
 */
export type ReinforcementRecommendationInput = {
  activityName: string;
  reinforcerName: string;
  type: string;
  effectiveness?: string | null;
};

/**
 * Helper function to generate a reinforcement recommendation
 * @param input Properties needed for generating a reinforcement recommendation
 * @returns Recommendation string for future sessions
 */
export function generateActivityReinforcementRecommendation(
  input: ReinforcementRecommendationInput,
): string {
  const { activityName, reinforcerName, type, effectiveness } = input;

  if (!effectiveness) {
    return `Consider tracking the effectiveness of "${reinforcerName}" (${type}) during the "${activityName}" activity in future sessions.`;
  }

  switch (effectiveness) {
    case "High":
      return `Continue using "${reinforcerName}" (${type}) as a primary reinforcer during the "${activityName}" activity.`;
    case "Medium":
      return `"${reinforcerName}" (${type}) was moderately effective during the "${activityName}" activity. Consider maintaining its use while exploring additional reinforcement options.`;
    case "Low":
      return `"${reinforcerName}" (${type}) had low effectiveness during the "${activityName}" activity. Consider trying alternative reinforcers in future sessions.`;
    case "Variable":
      return `The effectiveness of "${reinforcerName}" (${type}) during the "${activityName}" activity was variable. Monitor for consistency and context when it was most effective.`;
    case "Not Effective":
      return `"${reinforcerName}" (${type}) was not effective during the "${activityName}" activity. Discontinue using it and identify new reinforcement strategies.`;
    default:
      return `Continue monitoring the effectiveness of "${reinforcerName}" (${type}) during the "${activityName}" activity.`;
  }
}

/**
 * Helper function to determine if a reinforcement type is appropriate for a given context
 * @param type The reinforcement type to check
 * @param context The context description
 * @returns Boolean indicating if the reinforcement is appropriate
 */
export function isReinforcementAppropriate(
  type: string,
  context: {
    isGroupActivity?: boolean;
    isHomeSetting?: boolean;
    isCommunityBased?: boolean;
    isStructuredTask?: boolean;
  },
): boolean {
  const { isGroupActivity, isCommunityBased, isStructuredTask } = context;

  // Some reinforcements may not be appropriate in certain contexts
  // These are general guidelines - clinical judgment should always be used

  if (isGroupActivity && ["Edible", "Tangible Item"].includes(type)) {
    // May cause inequity in group settings unless all children receive same
    return false;
  }

  if (isCommunityBased && ["Token Economy"].includes(type)) {
    // May be difficult to implement in community settings
    return false;
  }

  if (!isStructuredTask && ["Token Economy"].includes(type)) {
    // Token economies work best in structured tasks with clear expectations
    return false;
  }

  return true;
}
