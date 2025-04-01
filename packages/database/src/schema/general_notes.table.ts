import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sessions } from "./session.table";

/**
 * General notes table schema for tracking additional information about a therapy session
 */
export const generalNotes = pgTable("general_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull()
    .unique(), // One general notes record per session
  sessionNotes: text("session_notes"),
  caregiverFeedback: text("caregiver_feedback"),
  environmentalFactors: text("environmental_factors"),
  nextSessionFocus: text("next_session_focus"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types for TypeScript type inference
export type GeneralNote = typeof generalNotes.$inferSelect;
export type GeneralNoteInsert = typeof generalNotes.$inferInsert;

// Zod schemas for validation
export const insertGeneralNoteSchema = createInsertSchema(generalNotes, {
  sessionId: z.string().uuid(),
  sessionNotes: z.string().optional().nullable(),
  caregiverFeedback: z.string().optional().nullable(),
  environmentalFactors: z.string().optional().nullable(),
  nextSessionFocus: z.string().optional().nullable(),
});

export const selectGeneralNoteSchema = createSelectSchema(generalNotes, {
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  sessionNotes: z.string().nullable(),
  caregiverFeedback: z.string().nullable(),
  environmentalFactors: z.string().nullable(),
  nextSessionFocus: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// Common environmental factors
export const COMMON_ENVIRONMENTAL_FACTORS = [
  "Noisy environment",
  "Quiet environment",
  "Distractions present",
  "New setting",
  "Familiar setting",
  "Multiple people present",
  "One-on-one setting",
  "Temperature issues",
  "Lighting issues",
  "Limited space",
  "Sensory triggers present",
] as const;

/**
 * Helper function to generate a formatted general notes summary
 * @param note General notes object
 * @returns A formatted string with the general notes summary
 */
export function generateGeneralNotesSummary(
  note: Partial<GeneralNote>,
): string {
  const sections: string[] = [];

  if (note.sessionNotes) {
    sections.push(`Session Notes: ${note.sessionNotes}`);
  }

  if (note.caregiverFeedback) {
    sections.push(`Caregiver Feedback: ${note.caregiverFeedback}`);
  }

  if (note.environmentalFactors) {
    sections.push(`Environmental Factors: ${note.environmentalFactors}`);
  }

  if (note.nextSessionFocus) {
    sections.push(`Next Session Focus: ${note.nextSessionFocus}`);
  }

  return sections.length > 0
    ? sections.join("\n\n")
    : "No general notes recorded for this session.";
}

/**
 * Helper function to extract key points from session notes
 * @param sessionNotes The full session notes text
 * @param maxPoints Maximum number of key points to extract
 * @returns Array of key points extracted from the notes
 */
export function extractKeyPoints(
  sessionNotes: string | null | undefined,
  maxPoints: number = 3,
): string[] {
  if (!sessionNotes) {
    return [];
  }

  // Simple extraction based on sentence boundaries and length
  // A more sophisticated approach could use NLP techniques
  const sentences = sessionNotes
    .split(/[.!?]+/) // Split by sentence-ending punctuation
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 200); // Remove empty and very long sentences

  if (sentences.length <= maxPoints) {
    return sentences;
  }

  // Use heuristics to select key sentences (simplistic approach)
  // Look for sentences with keywords that suggest importance
  const keywordPatterns = [
    /\b(important|significant|key|main|critical|essential|notable|fundamental)\b/i,
    /\b(improvement|progress|regression|change|development)\b/i,
    /\b(recommend|suggest|advise|propose)\b/i,
    /\b(focus|goal|target|objective|aim)\b/i,
    /\b(successful|effective|beneficial|helpful)\b/i,
  ];

  // Score sentences based on keywords
  const scoredSentences = sentences.map((sentence) => {
    let score = 0;
    keywordPatterns.forEach((pattern) => {
      if (pattern.test(sentence)) {
        score += 1;
      }
    });
    return { sentence, score };
  });

  // Sort by score and take top maxPoints
  return scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPoints)
    .map((item) => item.sentence);
}
