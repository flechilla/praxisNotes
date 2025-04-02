/**
 * Activity prompt type definitions
 * Types for prompting methods used during activities
 */

/**
 * Valid prompt types
 */
export type PromptType =
  | "verbal"
  | "gestural"
  | "physical"
  | "visual"
  | "model"
  | "proximity"
  | "other";

/**
 * Represents a type of prompt used during an activity
 */
export type ActivityPrompt = {
  id: string;
  activityId: string;
  type: PromptType | string;
  count: number; // Number of times this prompt was used
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * New activity prompt for creation
 */
export type NewActivityPrompt = Omit<
  ActivityPrompt,
  "id" | "createdAt" | "updatedAt" | "activityId"
> & {
  id?: string;
  activityId?: string;
};

/**
 * Update data for an activity prompt
 */
export type UpdateActivityPrompt = Partial<Omit<ActivityPrompt, "id">> & {
  id: string;
};

/**
 * Activity prompt in form context
 * Simplified version for use in forms
 */
export type ActivityPromptForm = {
  type: PromptType | string;
  count: number;
  notes?: string;
};
