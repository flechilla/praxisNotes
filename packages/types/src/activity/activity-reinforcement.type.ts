/**
 * Activity reinforcement type definitions
 * Types for reinforcement methods used during activities
 */

/**
 * Represents a reinforcement used during an activity
 */
export type ActivityReinforcement = {
  id: string;
  activityId: string;
  reinforcerId?: string; // Optional reference to a predefined reinforcer
  reinforcementName: string;
  reinforcementDescription?: string;
  notes?: string;
  effectiveness?: string; // "low", "moderate", "high"
  createdAt?: Date;
  updatedAt?: Date;
  reinforcementType?: string;
};

/**
 * New activity reinforcement for creation
 */
export type NewActivityReinforcement = Omit<
  ActivityReinforcement,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

/**
 * Update data for an activity reinforcement
 */
export type UpdateActivityReinforcement = Partial<
  Omit<ActivityReinforcement, "id">
> & {
  id: string;
};

/**
 * Activity reinforcement in form context
 * Simplified version for use in forms
 */
export type ActivityReinforcementForm = {
  reinforcerId?: string;
  reinforcerName: string;
  type: string;
  notes?: string;
  effectiveness?: string;
};
