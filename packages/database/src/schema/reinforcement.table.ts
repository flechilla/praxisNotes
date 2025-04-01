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
import { relations } from "drizzle-orm";
import { organizations } from "./organization.table";

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
 * Represents available reinforcements in the system
 * Can be organization-specific (organizationId set) or system-wide (organizationId null)
 */
export const reinforcements = pgTable("reinforcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  type: reinforcementTypeEnum("type").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define reinforcement relations
 */
export const reinforcementsRelations = relations(reinforcements, ({ one }) => ({
  organization: one(organizations, {
    fields: [reinforcements.organizationId],
    references: [organizations.id],
  }),
}));

// Types derived from the schema
export type Reinforcement = typeof reinforcements.$inferSelect;
export type ReinforcementInsert = typeof reinforcements.$inferInsert;

// Zod schemas for validation
export const insertReinforcementSchema = createInsertSchema(reinforcements);
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
  reinforcement: Pick<Reinforcement, "name" | "type"> & {
    effectiveness?: string | null;
    frequency?: number;
  },
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
