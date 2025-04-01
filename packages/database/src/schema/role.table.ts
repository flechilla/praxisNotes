import { pgTable, varchar, timestamp, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./user.table";

/**
 * Role table schema definition
 * Represents roles that can be assigned to users
 */
export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define role relations
 */
export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

// Types derived from the schema
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;

// Zod schemas for validation
export const insertRoleSchema = createInsertSchema(roles, {
  name: z.string().min(1).max(100),
  description: z.string().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectRoleSchema = createSelectSchema(roles);
