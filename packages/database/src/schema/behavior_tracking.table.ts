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

// Define enums for behavior intensity
export const intensityLevelEnum = pgEnum("intensity_level", [
  "1 - mild",
  "2 - moderate",
  "3 - severe",
  "4 - very severe",
  "5 - extreme",
]);

/**
 * Behavior tracking table schema definition
 * Represents behaviors tracked during therapy sessions
 */
export const behaviorTrackings = pgTable("behavior_trackings", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  definition: text("definition"),
  frequency: integer("frequency").default(0),
  duration: integer("duration").default(0), // in minutes or seconds
  intensity: intensityLevelEnum("intensity"),
  antecedent: text("antecedent"),
  consequence: text("consequence"),
  intervention: text("intervention"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types derived from the schema
export type BehaviorTrackingSelect = typeof behaviorTrackings.$inferSelect;
export type BehaviorTrackingInsert = typeof behaviorTrackings.$inferInsert;

// Zod schemas for validation
export const insertBehaviorTrackingSchema = createInsertSchema(
  behaviorTrackings,
  {
    sessionId: z.string().uuid(),
    name: z.string().min(1).max(255),
    definition: z.string().optional().nullable(),
    frequency: z.number().int().nonnegative().default(0),
    duration: z.number().int().nonnegative().default(0),
    intensity: z
      .enum([
        "1 - mild",
        "2 - moderate",
        "3 - severe",
        "4 - very severe",
        "5 - extreme",
      ])
      .optional()
      .nullable(),
    antecedent: z.string().optional().nullable(),
    consequence: z.string().optional().nullable(),
    intervention: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  },
).omit({ id: true, createdAt: true, updatedAt: true });

export const selectBehaviorTrackingSchema =
  createSelectSchema(behaviorTrackings);

// Common intervention types
export const interventionTypes = [
  "Redirection",
  "Response Blocking",
  "Differential Reinforcement of Other Behavior (DRO)",
  "Differential Reinforcement of Incompatible Behavior (DRI)",
  "Differential Reinforcement of Alternative Behavior (DRA)",
  "Escape Extinction",
  "Token Economy",
  "Time-out",
  "Visual Supports",
];

// Helper function to generate behavior description
export const generateBehaviorDescription = (
  behavior: Partial<BehaviorTrackingSelect>,
): string => {
  let description = `${behavior.name || "Behavior"}`;

  if (behavior.frequency && behavior.frequency > 0) {
    description += ` occurred ${behavior.frequency} times`;
  }

  if (behavior.duration && behavior.duration > 0) {
    description +=
      behavior.frequency && behavior.frequency > 0
        ? ` with a total duration of ${behavior.duration} minutes.`
        : ` lasted for ${behavior.duration} minutes.`;
  }

  if (behavior.intensity) {
    description += ` Intensity was ${behavior.intensity}.`;
  }

  return description;
};
