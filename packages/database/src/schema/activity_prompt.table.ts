import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
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
  type: promptLevelEnum("type").notNull(),
  frequency: integer("frequency").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types for TypeScript type inference
export type ActivityPrompt = typeof activityPrompts.$inferSelect;
export type ActivityPromptInsert = typeof activityPrompts.$inferInsert;

// Zod schemas for validation
export const insertActivityPromptSchema = createInsertSchema(activityPrompts, {
  activityId: z.string().uuid(),
  type: z.enum([
    "Independent",
    "Verbal",
    "Gestural",
    "Model",
    "Partial Physical",
    "Full Physical",
  ]),
  frequency: z.number().int().min(0).optional(),
  notes: z.string().optional().nullable(),
});

export const selectActivityPromptSchema = createSelectSchema(activityPrompts);

// Common prompt types (hierarchical order from least to most intrusive)
export const PROMPT_TYPES = [
  "Independent", // No prompt needed
  "Natural Cue", // Environmental or situational cue
  "Indirect Verbal", // Indirect hint or question
  "Direct Verbal", // Clear verbal instruction
  "Gestural", // Pointing, nodding, or other gesture
  "Visual", // Picture, written instruction, or other visual aid
  "Model", // Demonstrating the desired behavior
  "Partial Physical", // Light physical guidance
  "Full Physical", // Hand-over-hand assistance
] as const;

/**
 * Helper function to get the prompt hierarchy level (lower is less intrusive)
 * @param promptType The prompt type to check
 * @returns Numeric level in the prompt hierarchy, -1 if not found
 */
export function getPromptHierarchyLevel(promptType: string): number {
  return PROMPT_TYPES.findIndex((p) => p === promptType);
}

/**
 * Helper function to get a less intrusive prompt type (for prompt fading)
 * @param currentPrompt The current prompt type
 * @returns The next less intrusive prompt type, or null if already at independent
 */
export function getLessIntrusivePrompt(currentPrompt: string): string | null {
  const currentLevel = getPromptHierarchyLevel(currentPrompt);

  if (currentLevel <= 0 || currentLevel === -1) {
    return null;
  }

  return PROMPT_TYPES[currentLevel - 1] || null;
}

/**
 * Helper function to get a more intrusive prompt type (if current prompt is ineffective)
 * @param currentPrompt The current prompt type
 * @returns The next more intrusive prompt type, or null if already at most intrusive
 */
export function getMoreIntrusivePrompt(currentPrompt: string): string | null {
  const currentLevel = getPromptHierarchyLevel(currentPrompt);

  if (currentLevel === -1 || currentLevel === PROMPT_TYPES.length - 1) {
    return null;
  }

  return PROMPT_TYPES[currentLevel + 1] || null;
}

/**
 * Helper function to summarize prompt usage for an activity
 * @param prompts Array of activity prompts
 * @returns Summary string of prompt usage
 */
export function summarizePromptUsage(
  prompts: Pick<ActivityPrompt, "type" | "frequency">[],
): string {
  if (!prompts.length) {
    return "No prompts recorded for this activity";
  }

  // Sort by hierarchy level (least to most intrusive)
  const sortedPrompts = [...prompts].sort((a, b) => {
    return getPromptHierarchyLevel(a.type) - getPromptHierarchyLevel(b.type);
  });

  const totalFrequency = sortedPrompts.reduce((sum, p) => sum + p.frequency, 0);

  const promptSummary = sortedPrompts
    .map(
      (p) =>
        `${p.type}: ${p.frequency} (${Math.round((p.frequency / totalFrequency) * 100)}%)`,
    )
    .join(", ");

  return `Prompt usage: ${promptSummary}`;
}
