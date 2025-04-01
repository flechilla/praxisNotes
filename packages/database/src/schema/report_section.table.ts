import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { reports } from "./report.table";

/**
 * Report sections table schema definition
 * Represents individual sections within a structured report
 */
export const reportSections = pgTable("report_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id")
    .references(() => reports.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types derived from the schema
export type ReportSectionSelect = typeof reportSections.$inferSelect;
export type ReportSectionInsert = typeof reportSections.$inferInsert;

// Zod schemas for validation
export const insertReportSectionSchema = createInsertSchema(reportSections, {
  reportId: z.string().uuid(),
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  order: z.number().int().nonnegative(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectReportSectionSchema = createSelectSchema(reportSections);

// Standard section titles for structured reports
export const standardSectionTitles = [
  "Summary",
  "Skill Acquisition",
  "Behavior Management",
  "Reinforcement",
  "Observations",
  "Recommendations",
  "Next Steps",
];

// Helper function to create standard report sections
export const createStandardSections = (
  reportId: string,
  sections: Record<string, string>,
): ReportSectionInsert[] => {
  return Object.entries(sections).map(([title, content], index) => ({
    reportId,
    title,
    content,
    order: index,
  }));
};
