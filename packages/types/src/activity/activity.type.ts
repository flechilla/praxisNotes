/**
 * Activity type definitions
 * Types representing session activities and related data
 */

import { Skill } from "../skills/skill.type";
import {
  ActivityBehavior,
  NewActivityBehavior,
} from "./activity-behavior.type";
import { ActivityPrompt, NewActivityPrompt } from "./activity-prompt.type";
import {
  ActivityReinforcement,
  NewActivityReinforcement,
} from "./activity-reinforcement.type";
import { ActivitySkill, NewActivitySkill } from "./activity-skill.type";

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
  behaviors?: NewActivityBehavior[];
  promptsUsed?: NewActivityPrompt[];
  reinforcement?: NewActivityReinforcement;
  skills?: NewActivitySkill[];
};

/**
 * Activity update data
 */
export type UpdateActivity = Partial<Omit<Activity, "id">> & {
  id: string;
  behaviors?: ActivityBehavior[];
  promptsUsed?: ActivityPrompt[];
  reinforcement?: ActivityReinforcement;
  skills?: ActivitySkill[];
};

/**
 * Collection of activities for a session
 */
export type ActivitiesFormData = {
  activities: ActivityWithRelations[];
};
