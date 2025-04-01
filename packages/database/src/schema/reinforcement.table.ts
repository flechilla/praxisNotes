import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sessions } from "./session.table";

// Define enums for reinforcement types and effectiveness
export const reinforcementTypeEnum = pgEnum("reinforcement_type", [
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
]);

export const effectivenessLevelEnum = pgEnum("effectiveness_level", [
  "High",
  "Medium",
  "Low",
  "Variable",
  "Not Effective",
]);

/**
 * Reinforcement table schema for tracking reinforcements used during therapy sessions
 */
export const reinforcements = pgTable("reinforcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: reinforcementTypeEnum("type").notNull(),
  effectiveness: effectivenessLevelEnum("effectiveness"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types for TypeScript type inference
export type Reinforcement = typeof reinforcements.$inferSelect;
export type ReinforcementInsert = typeof reinforcements.$inferInsert;

// Zod schemas for validation
export const insertReinforcementSchema = createInsertSchema(reinforcements, {
  sessionId: z.string().uuid(),
  name: z.string().min(1).max(255),
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
});

export const selectReinforcementSchema = createSelectSchema(reinforcements, {
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  effectiveness: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * Helper function to determine if a reinforcement should be used more or less based on effectiveness
 * @param effectiveness The effectiveness level of the reinforcement
 * @returns Recommendation string
 */
export function generateReinforcementRecommendation(
  reinforcement: Pick<Reinforcement, "name" | "effectiveness">,
): string {
  if (!reinforcement.effectiveness) {
    return `Consider documenting the effectiveness of "${reinforcement.name}" in future sessions.`;
  }

  switch (reinforcement.effectiveness) {
    case "High":
      return `"${reinforcement.name}" was highly effective. Continue using as a primary reinforcer.`;
    case "Medium":
      return `"${reinforcement.name}" was moderately effective. Continue using but monitor for consistency.`;
    case "Low":
      return `"${reinforcement.name}" had low effectiveness. Consider alternative reinforcers.`;
    case "Variable":
      return `"${reinforcement.name}" showed variable effectiveness. Consider using in conjunction with other reinforcers.`;
    case "Not Effective":
      return `"${reinforcement.name}" was not effective. Recommend discontinuing and identifying new reinforcers.`;
    default:
      return `Continue evaluating the effectiveness of "${reinforcement.name}" in future sessions.`;
  }
}
