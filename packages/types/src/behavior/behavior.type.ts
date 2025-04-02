/**
 * Behavior type definitions
 * Types for behavioral data used across the application
 */

/**
 * Base behavior type
 */
export type Behavior = {
  id: string;
  name: string;
  definition: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Behavior option for UI components
 */
export type BehaviorOption = {
  id: string;
  name: string;
  definition: string;
  category?: string;
};

/**
 * New behavior for creation
 */
export type NewBehavior = Omit<Behavior, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

/**
 * Update behavior for existing entries
 */
export type UpdateBehavior = Partial<Omit<Behavior, "id">> & {
  id: string;
};

/**
 * Response structure for behavior API requests
 */
export type BehaviorResponse = {
  behavior?: Behavior;
  behaviors?: Behavior[];
  error?: string;
};

/**
 * Represents a tracking record for a behavior
 */
export type BehaviorTracking = {
  id: string;
  sessionId: string;
  behaviorName: string;
  definition?: string | null;
  antecedent?: string | null;
  consequence?: string | null;
  frequency?: number;
  duration?: number | null; // in seconds
  intensity?: string | null;
  notes?: string | null;
  interventionUsed?: string | null; // JSON string
  createdAt: Date;
  updatedAt: Date;
};
