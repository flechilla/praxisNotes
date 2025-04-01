import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { sessions } from "./session.table";
import {
  moodEnum,
  MOOD,
  MOOD_VALUES,
  MOOD_EMOJI_MAP,
} from "../enums/mood.enum";
import {
  attentionLevelEnum,
  ATTENTION_LEVEL,
  ATTENTION_LEVEL_VALUES,
  ATTENTION_LEVEL_DESCRIPTIONS,
} from "../enums/attention-level.enum";

/**
 * Initial status table schema
 * Represents the client's initial status at the beginning of a therapy session
 */
export const initialStatuses = pgTable("initial_statuses", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  mood: moodEnum("mood"),
  attention: attentionLevelEnum("attention"),
  contextNotes: text("context_notes"),
  physicalState: text("physical_state"),
  sessionReadiness: text("session_readiness"),
  caregiverReport: text("caregiver_report"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define initial status relations
 */
export const initialStatusesRelations = relations(
  initialStatuses,
  ({ one }) => ({
    session: one(sessions, {
      fields: [initialStatuses.sessionId],
      references: [sessions.id],
    }),
  }),
);

// Types derived from the schema
export type InitialStatus = typeof initialStatuses.$inferSelect;
export type InitialStatusInsert = typeof initialStatuses.$inferInsert;

// Zod schemas for validation
export const insertInitialStatusSchema = createInsertSchema(initialStatuses, {
  sessionId: z.string().uuid(),
  mood: z
    .enum(MOOD_VALUES as [string, ...string[]])
    .optional()
    .nullable(),
  attention: z
    .enum(ATTENTION_LEVEL_VALUES as [string, ...string[]])
    .optional()
    .nullable(),
  contextNotes: z.string().optional().nullable(),
  physicalState: z.string().optional().nullable(),
  sessionReadiness: z.string().optional().nullable(),
  caregiverReport: z.string().optional().nullable(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectInitialStatusSchema = createSelectSchema(initialStatuses);

/**
 * Generate a summary of the client's initial status
 * @param initialStatus The initial status record
 * @returns A formatted summary string
 */
export function summarizeInitialStatus(
  initialStatus: Pick<
    InitialStatus,
    "mood" | "attention" | "physicalState" | "caregiverReport"
  >,
): string {
  const moodEmoji = initialStatus.mood
    ? MOOD_EMOJI_MAP[initialStatus.mood]
    : "";

  let summary = `Client Status: ${moodEmoji} ${initialStatus.mood || "Not recorded"}`;

  if (initialStatus.attention) {
    summary += ` | Attention: ${initialStatus.attention.replace(/_/g, " ")}`;
  }

  if (initialStatus.physicalState) {
    summary += ` | Physical: ${initialStatus.physicalState}`;
  }

  if (initialStatus.caregiverReport) {
    const shortReport =
      initialStatus.caregiverReport.length > 50
        ? initialStatus.caregiverReport.substring(0, 50) + "..."
        : initialStatus.caregiverReport;
    summary += ` | Caregiver Report: ${shortReport}`;
  }

  return summary;
}
