import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sessions } from "./session.table";

/**
 * Initial status table schema for tracking client status at the beginning of a session
 */
export const initialStatuses = pgTable("initial_statuses", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull()
    .unique(), // One initial status per session
  clientStatus: text("client_status"),
  caregiverReport: text("caregiver_report"),
  initialResponse: text("initial_response"),
  medicationChanges: text("medication_changes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types for TypeScript type inference
export type InitialStatus = typeof initialStatuses.$inferSelect;
export type InitialStatusInsert = typeof initialStatuses.$inferInsert;

// Zod schemas for validation
export const insertInitialStatusSchema = createInsertSchema(initialStatuses, {
  sessionId: z.string().uuid(),
  clientStatus: z.string().optional().nullable(),
  caregiverReport: z.string().optional().nullable(),
  initialResponse: z.string().optional().nullable(),
  medicationChanges: z.string().optional().nullable(),
});

export const selectInitialStatusSchema = createSelectSchema(initialStatuses, {
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  clientStatus: z.string().nullable(),
  caregiverReport: z.string().nullable(),
  initialResponse: z.string().nullable(),
  medicationChanges: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// Common client status indicators
export const COMMON_CLIENT_STATUS = [
  "Calm",
  "Energetic",
  "Tired",
  "Agitated",
  "Focused",
  "Distracted",
  "Happy",
  "Sad",
  "Anxious",
  "Frustrated",
] as const;

/**
 * Helper function to generate a formatted initial status summary
 * @param initialStatus Initial status object with client information
 * @returns A formatted string with the initial status summary
 */
export function generateInitialStatusSummary(
  initialStatus: Partial<InitialStatus>,
): string {
  const sections: string[] = [];

  if (initialStatus.clientStatus) {
    sections.push(`Client Status: ${initialStatus.clientStatus}`);
  }

  if (initialStatus.caregiverReport) {
    sections.push(`Caregiver Report: ${initialStatus.caregiverReport}`);
  }

  if (initialStatus.initialResponse) {
    sections.push(
      `Initial Response to Session: ${initialStatus.initialResponse}`,
    );
  }

  if (initialStatus.medicationChanges) {
    sections.push(`Medication Changes: ${initialStatus.medicationChanges}`);
  }

  return sections.length > 0
    ? sections.join("\n\n")
    : "No initial status information recorded for this session.";
}

/**
 * Helper function to check if medication changes require follow-up
 * @param medicationChanges The medication changes text
 * @returns Boolean indicating if follow-up is recommended
 */
export function medicationChangeRequiresFollowUp(
  medicationChanges: string | null | undefined,
): boolean {
  if (!medicationChanges) {
    return false;
  }

  // Keywords that might indicate a need for follow-up
  const followUpKeywords = [
    "new medication",
    "started",
    "increased",
    "decreased",
    "stopped",
    "side effect",
    "concern",
    "issue",
    "problem",
    "difficulty",
    "adverse",
    "reaction",
  ];

  const normalizedChanges = medicationChanges.toLowerCase();

  return followUpKeywords.some((keyword) =>
    normalizedChanges.includes(keyword.toLowerCase()),
  );
}
