import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { activities } from "./activity.table";
import {
  reinforcementTypeEnum,
  reinforcementEffectivenessEnum,
} from "./reinforcement.table";

/**
 * Activity reinforcement table schema for tracking reinforcements used during specific activities
 */
export const activityReinforcements = pgTable("activity_reinforcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activities.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: reinforcementTypeEnum("type").notNull(),
  description: text("description"),
  frequency: integer("frequency").default(0),
  effectiveness: reinforcementEffectivenessEnum("effectiveness"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define activity reinforcement relations
 */
export const activityReinforcementsRelations = relations(
  activityReinforcements,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityReinforcements.activityId],
      references: [activities.id],
    }),
  }),
);

// Types for TypeScript type inference
export type ActivityReinforcement = typeof activityReinforcements.$inferSelect;
export type ActivityReinforcementInsert =
  typeof activityReinforcements.$inferInsert;

// Zod schemas for validation
export const insertActivityReinforcementSchema = createInsertSchema(
  activityReinforcements,
  {
    activityId: z.string().uuid(),
    name: z.string().min(1).max(255),
    type: z.enum([
      "primary",
      "secondary",
      "social",
      "token",
      "activity",
      "other",
    ]),
    description: z.string().optional().nullable(),
    frequency: z.number().int().nonnegative().optional(),
    effectiveness: z.enum(["low", "medium", "high"]).optional().nullable(),
    notes: z.string().optional().nullable(),
  },
).omit({ id: true, createdAt: true, updatedAt: true });

export const selectActivityReinforcementSchema = createSelectSchema(
  activityReinforcements,
  {
    id: z.string().uuid(),
    activityId: z.string().uuid(),
    name: z.string(),
    type: z.string(),
    description: z.string().nullable(),
    frequency: z.number(),
    effectiveness: z.string().nullable(),
    notes: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  },
);

/**
 * Helper function to determine if a reinforcement should be used more based on effectiveness
 * @param activityReinforcement The reinforcement data
 * @returns Boolean indicating if reinforcement should be used more frequently
 */
export function shouldIncreaseReinforcementUse(
  activityReinforcement: Pick<ActivityReinforcement, "effectiveness" | "name">,
): boolean {
  return activityReinforcement.effectiveness === "high";
}

/**
 * Helper function to generate specific reinforcement recommendation
 * @param activityReinforcement The reinforcement data
 * @returns A specific recommendation for future use
 */
export function generateReinforcementRecommendation(
  activityReinforcement: Pick<
    ActivityReinforcement,
    "name" | "effectiveness" | "frequency"
  >,
): string {
  if (!activityReinforcement.effectiveness) {
    return `Continue tracking the effectiveness of "${activityReinforcement.name}"`;
  }

  switch (activityReinforcement.effectiveness) {
    case "high":
      return `Continue using "${activityReinforcement.name}" as it was highly effective`;
    case "medium":
      return `Consider pairing "${activityReinforcement.name}" with another reinforcer for increased effectiveness`;
    case "low":
      return `Consider replacing "${activityReinforcement.name}" with a different reinforcer`;
    default:
      return `Continue evaluating "${activityReinforcement.name}"`;
  }
}

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
