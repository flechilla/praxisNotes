import { pgEnum } from "drizzle-orm/pg-core";

// Intensity level values as string literals
export const INTENSITY_LEVEL = {
  MILD: "1 - mild",
  MODERATE: "2 - moderate",
  SIGNIFICANT: "3 - significant",
  SEVERE: "4 - severe",
  EXTREME: "5 - extreme",
} as const;

// Union type of all intensity level values
export type IntensityLevel =
  (typeof INTENSITY_LEVEL)[keyof typeof INTENSITY_LEVEL];

// Array of all intensity level values for validation and iteration
export const INTENSITY_LEVEL_VALUES = Object.values(INTENSITY_LEVEL);

// PostgreSQL enum for database schema
export const intensityLevelEnum = pgEnum("intensity_level", [
  "1 - mild",
  "2 - moderate",
  "3 - significant",
  "4 - severe",
  "5 - extreme",
]);
