import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * Behaviors table schema definition
 * Represents predefined behaviors that can be tracked or associated with activities
 */
export const behaviors = pgTable("behaviors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  definition: text("definition").notNull(),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types derived from the schema
export type Behavior = typeof behaviors.$inferSelect;
export type BehaviorInsert = typeof behaviors.$inferInsert;

// Zod schemas for validation
export const insertBehaviorSchema = createInsertSchema(behaviors);
export const selectBehaviorSchema = createSelectSchema(behaviors);

// Common behavior categories
export const BEHAVIOR_CATEGORIES = [
  "Challenging",
  "Safety",
  "Instructional",
  "Emotional",
  "Disruptive",
  "Repetitive",
  "Eating",
  "Social",
  "Communication",
  "Self-Help",
  "Academic",
  "Attention",
  "Other",
] as const;
