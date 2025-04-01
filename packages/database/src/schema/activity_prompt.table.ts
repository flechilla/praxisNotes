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
import { promptLevelEnum } from "./skill_tracking.table";

/**
 * Activity prompt table schema for tracking prompts used during specific activities
 */
export const activityPrompts = pgTable("activity_prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activities.id, { onDelete: "cascade" })
    .notNull(),
  promptType: promptLevelEnum("prompt_type").notNull(),
  frequency: integer("frequency").default(0),
  targetSkill: varchar("target_skill", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define activity prompt relations
 */
export const activityPromptsRelations = relations(
  activityPrompts,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityPrompts.activityId],
      references: [activities.id],
    }),
  }),
);

// Types for TypeScript type inference
export type ActivityPrompt = typeof activityPrompts.$inferSelect;
export type ActivityPromptInsert = typeof activityPrompts.$inferInsert;

// Zod schemas for validation
export const insertActivityPromptSchema = createInsertSchema(activityPrompts, {
  activityId: z.string().uuid(),
  promptType: z.enum([
    "Independent",
    "Verbal",
    "Gestural",
    "Model",
    "Partial Physical",
    "Full Physical",
  ]),
  frequency: z.number().int().nonnegative().optional(),
  targetSkill: z.string().max(255).optional().nullable(),
  notes: z.string().optional().nullable(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectActivityPromptSchema = createSelectSchema(activityPrompts, {
  id: z.string().uuid(),
  activityId: z.string().uuid(),
  promptType: z.string(),
  frequency: z.number(),
  targetSkill: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// Helper text to explain prompt hierarchy (least to most intrusive)
export const PROMPT_HIERARCHY_DESCRIPTION = `
Prompts are listed from least to most intrusive:
1. Independent - No prompt needed
2. Verbal - Spoken instructions or hints
3. Gestural - Pointing, nodding, or other non-verbal cues
4. Model - Demonstrating the desired behavior
5. Partial Physical - Light physical guidance
6. Full Physical - Hand-over-hand assistance
`;

/**
 * Helper function to categorize prompt level by intrusiveness
 * @param promptType The type of prompt
 * @returns A categorization of intrusiveness level
 */
export function categorizePromptIntrusiveness(
  promptType: string | null | undefined,
): string {
  if (!promptType) return "Unknown";

  switch (promptType) {
    case "Independent":
      return "None";
    case "Verbal":
    case "Gestural":
      return "Low";
    case "Model":
      return "Moderate";
    case "Partial Physical":
    case "Full Physical":
      return "High";
    default:
      return "Unknown";
  }
}

/**
 * Helper function to generate a prompt usage summary
 * @param prompt The activity prompt record
 * @returns Formatted summary string
 */
export function summarizePromptUsage(
  prompt: Pick<ActivityPrompt, "promptType" | "frequency" | "targetSkill">,
): string {
  let summary = `Prompt: ${prompt.promptType}`;

  if (prompt.frequency && prompt.frequency > 0) {
    summary += ` | Used ${prompt.frequency} times`;
  }

  if (prompt.targetSkill) {
    summary += ` | For skill: ${prompt.targetSkill}`;
  }

  return summary;
}
