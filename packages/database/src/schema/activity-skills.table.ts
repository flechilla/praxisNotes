import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { activities } from "./activity.table";
import { skills } from "./skill.table";

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
 * Activity prompt table schema for tracking prompts used during specific activities
 */
export const activitySkills = pgTable("activity_skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activities.id, { onDelete: "cascade" })
    .notNull(),
  skillId: uuid("skill_id")
    .references(() => skills.id, { onDelete: "cascade" })
    .notNull(),
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

/**
 * Define activity prompt relations
 */
export const activitySkillsRelations = relations(activitySkills, ({ one }) => ({
  activity: one(activities, {
    fields: [activitySkills.activityId],
    references: [activities.id],
  }),
}));

// Types for TypeScript type inference
export type ActivitySkill = typeof activitySkills.$inferSelect;
export type ActivitySkillInsert = typeof activitySkills.$inferInsert;

// Zod schemas for validation
export const insertActivitySkillSchema = createInsertSchema(activitySkills, {
  activityId: z.string().uuid(),
  skillId: z.string().uuid(),
  promptLevel: z.enum([
    "Independent",
    "Verbal",
    "Gestural",
    "Model",
    "Partial Physical",
    "Full Physical",
  ]),
  trials: z.number().int().nonnegative(),
  mastery: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
  prompted: z.number().int().nonnegative(),
  incorrect: z.number().int().nonnegative(),
  notes: z.string().optional().nullable(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectActivitySkillSchema = createSelectSchema(activitySkills, {
  id: z.string().uuid(),
  activityId: z.string().uuid(),
  skillId: z.string().uuid(),
  promptLevel: z.string(),
  trials: z.number(),
  mastery: z.number(),
  correct: z.number(),
  prompted: z.number(),
  incorrect: z.number(),
  notes: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
