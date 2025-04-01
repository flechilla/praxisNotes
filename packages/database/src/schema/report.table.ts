import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { sessions } from "./session.table";
import { clients } from "./client.table";
import { users } from "./user.table";
import { reportSections } from "./report_section.table";
import {
  sessionStatusEnum,
  SESSION_STATUS_VALUES,
} from "../enums/session-status.enum";

/**
 * Reports table schema definition
 * Represents session reports generated for therapy sessions
 */
export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  summary: text("summary"),
  fullContent: text("full_content").notNull(),
  status: sessionStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define report relations
 */
export const reportsRelations = relations(reports, ({ one, many }) => ({
  session: one(sessions, {
    fields: [reports.sessionId],
    references: [sessions.id],
  }),
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [reports.clientId],
    references: [clients.id],
  }),
  sections: many(reportSections),
}));

// Types derived from the schema
export type ReportSelect = typeof reports.$inferSelect;
export type ReportInsert = typeof reports.$inferInsert;

// Zod schemas for validation
export const insertReportSchema = createInsertSchema(reports, {
  sessionId: z.string().uuid(),
  userId: z.string().uuid(),
  clientId: z.string().uuid(),
  summary: z.string().optional().nullable(),
  fullContent: z.string().min(1),
  status: z
    .enum(SESSION_STATUS_VALUES as [string, ...string[]])
    .default("draft"),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectReportSchema = createSelectSchema(reports);

// Utility function to extract summary from report content
export const extractSummary = (content: string, maxLength = 150): string => {
  // Remove markdown formatting symbols
  const plainText = content
    .replace(/#{1,6}\s+/g, "") // Remove headings
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
    .replace(/\*([^*]+)\*/g, "$1") // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // Remove links

  // Get first 150 characters or less
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + "..."
    : plainText;
};
