import { pgEnum } from "drizzle-orm/pg-core";

// Session status values as string literals
export const SESSION_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  REVIEWED: "reviewed",
} as const;

// Union type of all status values
export type SessionStatus =
  (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];

// Array of all status values for validation and iteration
export const SESSION_STATUS_VALUES = Object.values(SESSION_STATUS);

// PostgreSQL enum for database schema
export const sessionStatusEnum = pgEnum("session_status", [
  "draft",
  "submitted",
  "reviewed",
]);
