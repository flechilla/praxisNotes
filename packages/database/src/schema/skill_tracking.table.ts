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
});

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
