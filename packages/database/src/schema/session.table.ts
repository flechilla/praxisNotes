import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { clients } from "./client.table";
import { users } from "./user.table";

// Define enums for session status
export const sessionStatusEnum = pgEnum("session_status", [
  "draft",
  "submitted",
  "reviewed",
]);

/**
 * Sessions table schema definition
 * Represents therapy sessions conducted by RBTs with clients
 */
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  sessionDate: timestamp("session_date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  isActivityBased: boolean("is_activity_based").default(false).notNull(),
  status: sessionStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types derived from the schema
export type SessionSelect = typeof sessions.$inferSelect;
export type SessionInsert = typeof sessions.$inferInsert;

// Zod schemas for validation
export const insertSessionSchema = createInsertSchema(sessions, {
  clientId: z.string().uuid(),
  userId: z.string().uuid(),
  sessionDate: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  location: z.string().min(1).max(255),
  isActivityBased: z.boolean().default(false),
  status: z.enum(["draft", "submitted", "reviewed"]).default("draft"),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectSessionSchema = createSelectSchema(sessions);

// Validation function to ensure end time is after start time
export const validateSession = (data: SessionInsert): boolean => {
  if (data.startTime && data.endTime && data.startTime >= data.endTime) {
    return false;
  }
  return true;
};
