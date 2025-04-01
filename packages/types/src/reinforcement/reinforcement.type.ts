/**
 * Reinforcement type definitions
 * Types related to behavioral reinforcements
 */

/**
 * Base reinforcement type
 */
export type Reinforcement = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  category?: string;
  sessionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Reinforcement option used in UI components
 */
export type ReinforcementOption = {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  category?: string;
};

/**
 * New reinforcement for creation
 */
export type NewReinforcement = Omit<
  Reinforcement,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

/**
 * Update reinforcement for existing entries
 */
export type UpdateReinforcement = Partial<Omit<Reinforcement, "id">> & {
  id: string;
};
