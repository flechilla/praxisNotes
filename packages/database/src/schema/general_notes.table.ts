import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { sessions } from "./session.table";

// Define enum for note categories
export const noteCategoryEnum = pgEnum("note_category", [
  "general",
  "observation",
  "progress",
  "behavioral",
  "communication",
  "medical",
  "environmental",
  "caregiver",
  "other",
]);

/**
 * General notes table schema
 * Represents general notes added during therapy sessions
 */
export const generalNotes = pgTable("general_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  category: noteCategoryEnum("category").default("general"),
  important: boolean("important").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define general notes relations
 */
export const generalNotesRelations = relations(generalNotes, ({ one }) => ({
  session: one(sessions, {
    fields: [generalNotes.sessionId],
    references: [sessions.id],
  }),
}));

// Types derived from the schema
export type GeneralNote = typeof generalNotes.$inferSelect;
export type GeneralNoteInsert = typeof generalNotes.$inferInsert;

// Zod schemas for validation
export const insertGeneralNoteSchema = createInsertSchema(generalNotes, {
  sessionId: z.string().uuid(),
  title: z.string().max(255).optional(),
  content: z.string().min(1),
  category: z
    .enum([
      "general",
      "observation",
      "progress",
      "behavioral",
      "communication",
      "medical",
      "environmental",
      "caregiver",
      "other",
    ])
    .default("general"),
  important: z.boolean().default(false),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectGeneralNoteSchema = createSelectSchema(generalNotes);

// Category descriptions for UI purposes
export const NOTE_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  general: "General notes about the session",
  observation: "Observations of client behavior or skills",
  progress: "Notes about client progress",
  behavioral: "Notes about behavioral issues or interventions",
  communication: "Notes about communication skills or challenges",
  medical: "Notes about medical issues or concerns",
  environmental: "Notes about environmental factors",
  caregiver: "Notes about caregiver interactions or feedback",
  other: "Other miscellaneous notes",
};

/**
 * Helper function to categorize notes by importance
 * @param notes Array of general notes
 * @returns Object with important and non-important notes separated
 */
export function categorizeNotesByImportance(
  notes: Pick<
    GeneralNote,
    "id" | "title" | "content" | "important" | "category"
  >[],
): {
  importantNotes: Pick<
    GeneralNote,
    "id" | "title" | "content" | "important" | "category"
  >[];
  standardNotes: Pick<
    GeneralNote,
    "id" | "title" | "content" | "important" | "category"
  >[];
} {
  return {
    importantNotes: notes.filter((note) => note.important),
    standardNotes: notes.filter((note) => !note.important),
  };
}

/**
 * Helper function to create a brief summary of a note
 * @param note The general note to summarize
 * @param maxLength Maximum length of the summary
 * @returns Truncated summary string
 */
export function createNoteSummary(
  note: Pick<GeneralNote, "title" | "content" | "category">,
  maxLength = 100,
): string {
  const title = note.title || note.category;
  const contentPreview =
    note.content.length > maxLength
      ? `${note.content.substring(0, maxLength)}...`
      : note.content;

  return `${title}: ${contentPreview}`;
}
