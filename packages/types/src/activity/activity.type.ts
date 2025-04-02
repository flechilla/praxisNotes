/**
 * Activity type definitions
 * Types representing session activities and related data
 */

import { Skill } from "../skills/skill.type";
import { ActivityBehavior } from "./activity-behavior.type";
import { ActivityPrompt } from "./activity-prompt.type";
import { ActivityReinforcement } from "./activity-reinforcement.type";
import { ActivitySkill } from "./activity-skill.type";

/**
 * Main activity type representing a structured activity during a session
 */
export type Activity = {
  id: string;
  name: string;
  description: string;
  goal: string;
  location: string;
  duration?: number; // Duration in minutes
  sessionId: string;
  completed: boolean;
  completionNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Activity with all related data (behaviors, prompts, reinforcement)
 */
export type ActivityWithRelations = Activity & {
  behaviors: ActivityBehavior[];
  promptsUsed: ActivityPrompt[];
  reinforcement: ActivityReinforcement[];
  skills: ActivitySkill[];
};

/**
 * New activity for creation
 */
export type NewActivity = Omit<Activity, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
  behaviors?: ActivityBehavior[];
  promptsUsed?: ActivityPrompt[];
  reinforcement?: ActivityReinforcement;
};

/**
 * Activity update data
 */
export type UpdateActivity = Partial<Omit<Activity, "id">> & {
  id: string;
  behaviors?: ActivityBehavior[];
  promptsUsed?: ActivityPrompt[];
  reinforcement?: ActivityReinforcement;
};

/**
 * Collection of activities for a session
 */
export type ActivitiesFormData = {
  activities: ActivityWithRelations[];
};
