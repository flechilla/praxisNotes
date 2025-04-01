import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { sessions } from "./session.table";

// Define enum for reinforcement types
export const reinforcementTypeEnum = pgEnum("reinforcement_type", [
  "primary",
  "secondary",
  "social",
  "token",
  "activity",
  "other",
]);

// Define enum for reinforcement effectiveness
export const reinforcementEffectivenessEnum = pgEnum(
  "reinforcement_effectiveness",
  ["low", "medium", "high"],
);

/**
 * Reinforcement table schema
 * Represents reinforcements used during therapy sessions
 */
export const reinforcements = pgTable("reinforcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
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
 * Define reinforcement relations
 */
export const reinforcementsRelations = relations(reinforcements, ({ one }) => ({
  session: one(sessions, {
    fields: [reinforcements.sessionId],
    references: [sessions.id],
  }),
}));

// Types derived from the schema
export type Reinforcement = typeof reinforcements.$inferSelect;
export type ReinforcementInsert = typeof reinforcements.$inferInsert;

// Zod schemas for validation
export const insertReinforcementSchema = createInsertSchema(reinforcements, {
  sessionId: z.string().uuid(),
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
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectReinforcementSchema = createSelectSchema(reinforcements);

// Helper functions and constants for working with reinforcements
export const REINFORCEMENT_TYPE_DESCRIPTIONS: Record<string, string> = {
  primary: "Basic biological needs like food, water, or sensory stimulation",
  secondary:
    "Items or activities that gain value through association with primary reinforcers",
  social: "Praise, attention, high-fives, or social interaction",
  token: "Points, stars, or tokens exchangeable for other reinforcers",
  activity: "Preferred activities or privileges",
  other: "Other types of reinforcement not categorized above",
};

export const REINFORCEMENT_EFFECTIVENESS_DESCRIPTIONS: Record<string, string> =
  {
    low: "Minimal positive impact on behavior",
    medium: "Moderate positive impact on behavior",
    high: "Significant positive impact on behavior",
  };

/**
 * Generate a summary of reinforcement use
 * @param reinforcement The reinforcement to summarize
 * @returns Formatted summary string
 */
export function summarizeReinforcement(
  reinforcement: Pick<
    Reinforcement,
    "name" | "type" | "frequency" | "effectiveness"
  >,
): string {
  let summary = `Reinforcer: ${reinforcement.name} (${reinforcement.type})`;

  if (reinforcement.frequency && reinforcement.frequency > 0) {
    summary += ` | Used ${reinforcement.frequency} times`;
  }

  if (reinforcement.effectiveness) {
    summary += ` | Effectiveness: ${reinforcement.effectiveness}`;
  }

  return summary;
}
