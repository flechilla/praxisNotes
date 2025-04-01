/**
 * Represents a behavior option in the system
 */
export type Behavior = {
  id: string;
  name: string;
  definition: string;
  category?: string;
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
