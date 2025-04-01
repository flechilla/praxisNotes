import { pgEnum } from "drizzle-orm/pg-core";

// Attention level values as string literals
export const ATTENTION_LEVEL = {
  FOCUSED: "focused",
  EASILY_REDIRECTABLE: "easily_redirectable",
  MODERATE_REDIRECTION: "moderate_redirection",
  DIFFICULT_REDIRECTION: "difficult_redirection",
  UNABLE_TO_REDIRECT: "unable_to_redirect",
} as const;

// Union type of all attention level values
export type AttentionLevel =
  (typeof ATTENTION_LEVEL)[keyof typeof ATTENTION_LEVEL];

// Array of all attention level values for validation and iteration
export const ATTENTION_LEVEL_VALUES = Object.values(ATTENTION_LEVEL);

// PostgreSQL enum for database schema
export const attentionLevelEnum = pgEnum("attention_level", [
  "focused",
  "easily_redirectable",
  "moderate_redirection",
  "difficult_redirection",
  "unable_to_redirect",
]);

// Attention level descriptions
export const ATTENTION_LEVEL_DESCRIPTIONS: Record<AttentionLevel, string> = {
  focused: "Able to maintain attention on tasks with minimal redirection",
  easily_redirectable: "Occasionally off-task but easily redirected",
  moderate_redirection:
    "Frequently off-task and requires consistent redirection",
  difficult_redirection: "Significantly off-task and difficult to redirect",
  unable_to_redirect:
    "Cannot maintain attention on tasks despite interventions",
};
