/**
 * Activity behavior type definitions
 * Types for behavior observations during activities
 */

/**
 * Represents a behavior observation during an activity
 */
export type ActivityBehavior = {
  id: string;
  activityId: string;
  behaviorId?: string; // Optional reference to a predefined behavior
  behaviorName: string;
  definition?: string;
  intensity: string; // "low", "moderate", "high"
  interventionUsed: string[]; // Array of intervention strategies used
  interventionNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * New activity behavior for creation
 */
export type NewActivityBehavior = Omit<
  ActivityBehavior,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

/**
 * Update data for an activity behavior
 */
export type UpdateActivityBehavior = Partial<Omit<ActivityBehavior, "id">> & {
  id: string;
};

/**
 * Activity behavior in form context
 * This is a simplified version for use in forms
 */
export type ActivityBehaviorForm = {
  behaviorId?: string;
  behaviorName: string;
  definition?: string;
  intensity: string;
  interventionUsed: string[];
  interventionNotes?: string;
};
