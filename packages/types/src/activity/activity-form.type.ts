/**
 * Activity form type definitions
 * Types for activity-related forms
 */

import { ActivityBehaviorForm } from "./activity-behavior.type";
import { ActivityPromptForm } from "./activity-prompt.type";
import { ActivityReinforcementForm } from "./activity-reinforcement.type";

/**
 * Form representation of an activity
 * Simplified version of Activity for use in forms
 */
export type ActivityForm = {
  id?: string;
  name: string;
  description: string;
  goal: string;
  location: string;
  duration?: number;
  behaviors: ActivityBehaviorForm[];
  promptsUsed: ActivityPromptForm[];
  completed: boolean;
  completionNotes?: string;
  reinforcement: ActivityReinforcementForm;
};
