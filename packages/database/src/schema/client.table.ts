import {
  pgTable,
  varchar,
  timestamp,
  text,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { organizations } from "./organization.table";
import { sessions } from "./session.table";
import { reports } from "./report.table";

/**
 * Client table schema definition
 * Represents clients associated with organizations and users
 */
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  notes: text("notes"),
  // Reference to the organization that owns this client
  organizationId: uuid("organization_id")
    .references(() => organizations.id, {
      onDelete: "cascade",
    })
    .notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define client relations
 */
export const clientsRelations = relations(clients, ({ many }) => ({
  sessions: many(sessions),
  reports: many(reports),
}));

// Types derived from the schema
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

// Zod schemas for validation
export const insertClientSchema = createInsertSchema(clients, {
  name: z.string().min(1).max(255),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  organizationId: z.string().uuid(),
  isActive: z.boolean().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectClientSchema = createSelectSchema(clients);
