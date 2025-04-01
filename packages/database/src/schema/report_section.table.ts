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
import { relations } from "drizzle-orm";
import { reports } from "./report.table";

/**
 * Report sections table schema
 * Represents individual sections within a session report
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

/**
 * Define report section relations
 */
export const reportSectionsRelations = relations(reportSections, ({ one }) => ({
  report: one(reports, {
    fields: [reportSections.reportId],
    references: [reports.id],
  }),
}));

// Types derived from the schema
export type ReportSection = typeof reportSections.$inferSelect;
export type ReportSectionInsert = typeof reportSections.$inferInsert;

// Zod schemas for validation
export const insertReportSectionSchema = createInsertSchema(reportSections, {
  reportId: z.string().uuid(),
  title: z.string().min(1).max(255),
  content: z.string(),
  order: z.number().int().nonnegative(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectReportSectionSchema = createSelectSchema(reportSections);

/**
 * Common section titles for therapy session reports
 */
export const COMMON_SECTION_TITLES = [
  "Session Overview",
  "Goals and Objectives",
  "Activities Completed",
  "Skills Practiced",
  "Behaviors Observed",
  "Progress Notes",
  "Recommendations",
  "Next Steps",
  "Parent/Caregiver Involvement",
  "Materials Used",
] as const;

/**
 * Helper function to create initial default sections for a new report
 * @param reportId The UUID of the report to create sections for
 * @returns Array of report section objects ready for insertion
 */
export function createDefaultSections(
  reportId: string,
): Omit<ReportSectionInsert, "id" | "createdAt" | "updatedAt">[] {
  return [
    {
      reportId,
      title: "Session Overview",
      content: "",
      order: 0,
    },
    {
      reportId,
      title: "Goals and Objectives",
      content: "",
      order: 1,
    },
    {
      reportId,
      title: "Activities and Progress",
      content: "",
      order: 2,
    },
    {
      reportId,
      title: "Recommendations",
      content: "",
      order: 3,
    },
  ];
}
