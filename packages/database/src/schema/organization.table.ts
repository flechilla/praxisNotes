import { pgTable, varchar, timestamp, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Organization table schema definition
 * Represents organizations in the system
 */
export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types derived from the schema
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

// Zod schemas for validation
export const insertOrganizationSchema = createInsertSchema(organizations, {
  name: z.string().min(2).max(255),
  slug: z
    .string()
    .min(2)
    .max(255)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectOrganizationSchema = createSelectSchema(organizations);
