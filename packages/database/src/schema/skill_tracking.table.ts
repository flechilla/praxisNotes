import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  text,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { sessions } from "./session.table";

// Define enum for prompt levels
export const promptLevelEnum = pgEnum("prompt_level", [
  "Independent",
  "Verbal",
  "Gestural",
  "Model",
  "Partial Physical",
  "Full Physical",
]);

// Define enums for skill mastery level
export const masteryLevelEnum = pgEnum("mastery_level", [
  "not_introduced",
  "emerging",
  "developing",
  "mastered",
  "generalized",
]);

/**
 * Skill tracking table schema definition
 * Represents skills tracked during therapy sessions
 */
export const skillTrackings = pgTable("skill_trackings", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  target: varchar("target", { length: 255 }).notNull(),
  program: varchar("program", { length: 255 }).notNull(),
  promptLevel: promptLevelEnum("prompt_level"),
  trials: integer("trials").default(0).notNull(),
  mastery: integer("mastery").default(0).notNull(),
  correct: integer("correct").default(0).notNull(),
  prompted: integer("prompted").default(0).notNull(),
  incorrect: integer("incorrect").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  skillName: varchar("skill_name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  masteryLevel: masteryLevelEnum("mastery_level").default("not_introduced"),
});

/**
 * Define skill tracking relations
 */
export const skillTrackingsRelations = relations(skillTrackings, ({ one }) => ({
  session: one(sessions, {
    fields: [skillTrackings.sessionId],
    references: [sessions.id],
  }),
}));

// Types derived from the schema
export type SkillTrackingSelect = typeof skillTrackings.$inferSelect;
export type SkillTrackingInsert = typeof skillTrackings.$inferInsert;

// Zod schemas for validation
export const insertSkillTrackingSchema = createInsertSchema(skillTrackings, {
  sessionId: z.string().uuid(),
  name: z.string().min(1).max(255),
  target: z.string().min(1).max(255),
  program: z.string().min(1).max(255),
  promptLevel: z
    .enum([
      "Independent",
      "Verbal",
      "Gestural",
      "Model",
      "Partial Physical",
      "Full Physical",
    ])
    .optional()
    .nullable(),
  trials: z.number().int().min(0).optional(),
  mastery: z.number().int().min(0).max(100).optional(),
  correct: z.number().int().min(0).optional(),
  prompted: z.number().int().min(0).optional(),
  incorrect: z.number().int().min(0).optional(),
  notes: z.string().optional().nullable(),
  skillName: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  masteryLevel: z
    .enum([
      "not_introduced",
      "emerging",
      "developing",
      "mastered",
      "generalized",
    ])
    .default("not_introduced"),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectSkillTrackingSchema = createSelectSchema(skillTrackings);

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
