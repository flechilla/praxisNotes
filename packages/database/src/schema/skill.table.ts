import { pgTable, uuid, timestamp, varchar, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Skill tracking table schema definition
 * Represents skills tracked during therapy sessions
 */
export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  target: varchar("target", { length: 255 }).notNull(),
  program: varchar("program", { length: 255 }).notNull(),

  description: text("description"),
  category: varchar("category", { length: 100 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types derived from the schema
export type SkillSelect = typeof skills.$inferSelect;
export type SkillInsert = typeof skills.$inferInsert;

// Zod schemas for validation
export const insertSkillSchema = createInsertSchema(skills, {
  name: z.string().min(1).max(255),
  target: z.string().min(1).max(255),
  program: z.string().min(1).max(255),

  description: z.string().optional().nullable(),
  category: z.string().max(100).optional().nullable(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectSkillSchema = createSelectSchema(skills);

// Helper function to calculate success rate
export const calculateSuccessRate = (
  correct: number,
  prompted: number,
  incorrect: number,
): number => {
  const total = correct + prompted + incorrect;
  if (total === 0) return 0;

  // Weight correct responses more heavily than prompted responses
  const weightedCorrect = correct + prompted * 0.5;
  return Math.round((weightedCorrect / total) * 100);
};

// Common skill categories
export const SKILL_CATEGORIES = [
  "Communication",
  "Social",
  "Play",
  "Academic",
  "Daily Living",
  "Motor",
  "Cognitive",
  "Self-Regulation",
  "Attention",
  "Problem Solving",
] as const;

// Mastery level descriptions
export const MASTERY_LEVEL_DESCRIPTIONS: Record<string, string> = {
  not_introduced:
    "The skill has not been formally introduced or practiced yet.",
  emerging:
    "The skill is beginning to appear but requires full prompting and support.",
  developing:
    "The skill is being practiced with partial prompting or occasional support.",
  mastered:
    "The skill can be performed independently and consistently in familiar settings.",
  generalized:
    "The skill is used independently across different settings, people, and materials.",
};
