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

/**
 * User table schema definition
 * Represents users in the system
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  fullName: varchar("full_name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  // We store auth provider details here
  authProvider: varchar("auth_provider", { length: 50 }), // e.g., 'supabase', 'google', etc.
  authProviderId: varchar("auth_provider_id", { length: 255 }),
  // Password is optional if using external auth providers
  passwordHash: text("password_hash"),
  isActive: boolean("is_active").default(true).notNull(),
  isEmailVerified: boolean("is_email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

// Types derived from the schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  firstName: z.string().min(1).max(255).optional(),
  lastName: z.string().min(1).max(255).optional(),
  avatarUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  passwordHash: true,
  lastLoginAt: true,
});

export const selectUserSchema = createSelectSchema(users).omit({
  passwordHash: true,
});
