import { pgEnum } from "drizzle-orm/pg-core";

// Mood values as string literals
export const MOOD = {
  HAPPY: "happy",
  CALM: "calm",
  SAD: "sad",
  ANGRY: "angry",
  ANXIOUS: "anxious",
  TIRED: "tired",
  ENERGETIC: "energetic",
  FRUSTRATED: "frustrated",
  NEUTRAL: "neutral",
} as const;

// Union type of all mood values
export type Mood = (typeof MOOD)[keyof typeof MOOD];

// Array of all mood values for validation and iteration
export const MOOD_VALUES = Object.values(MOOD);

// PostgreSQL enum for database schema
export const moodEnum = pgEnum("mood", [
  "happy",
  "calm",
  "sad",
  "angry",
  "anxious",
  "tired",
  "energetic",
  "frustrated",
  "neutral",
]);

// Mood emoji mapping for display purposes
export const MOOD_EMOJI_MAP: Record<Mood, string> = {
  happy: "😊",
  calm: "😌",
  sad: "😢",
  angry: "😠",
  anxious: "😰",
  tired: "😴",
  energetic: "🤩",
  frustrated: "😤",
  neutral: "😐",
};
