import { Behavior } from "../behavior/behavior.type";
import { Reinforcement } from "../reinforcement/reinforcement.type";
import { Skill } from "../skills/skill.type";
import { ActivitiesFormData } from "../activity";

/**
 * Client information specific to session forms
 * @deprecated - Use proper Client type from client.type.ts and extend as needed
 */
export type ClientInfo = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  guardian: string;
  diagnosis: string;
  provider: string;
};

/**
 * Session form types are organized into sections.
 * Each section represents a logical grouping of data in the session form.
 */

/**
 * Basic session information (date, time, location)
 */
export type BasicInfoFormData = {
  sessionDate: string;
  startTime: string;
  endTime: string;
  location: string;
  clientId: string;
};

/**
 * Skill acquisition tracking data
 */
export type SkillAcquisitionFormData = {
  skills: Skill[];
};

/**
 * Behavior tracking data
 */
export type BehaviorTrackingFormData = {
  behaviors: Behavior[];
};

/**
 * Reinforcement tracking data
 */
export type ReinforcementFormData = {
  reinforcers: Reinforcement[];
};

/**
 * General session notes and feedback
 */
export type GeneralNotesFormData = {
  sessionNotes: string;
  caregiverFeedback: string;
  environmentalFactors: string;
  nextSessionFocus: string;
};

/**
 * Initial client status at the beginning of the session
 */
export type InitialStatusFormData = {
  clientStatus: string;
  caregiverReport: string;
  initialResponse: string;
  medicationChanges: string;
};

/**
 * Activity-based session form structure
 * This is the newer format that focuses on activities rather than discrete skills
 */
export type ActivityBasedSessionFormData = {
  basicInfo: BasicInfoFormData;
  initialStatus: InitialStatusFormData;
  activities: ActivitiesFormData;
  generalNotes: GeneralNotesFormData;
};

/**
 * Form navigation types
 * These types define the possible steps/pages in the session form
 */

/**
 * Steps in the traditional session form
 * @deprecated Consider migrating to activity-based format
 */
export type FormStep =
  | "basicInfo"
  | "skillAcquisition"
  | "behaviorTracking"
  | "reinforcement"
  | "generalNotes"
  | "reportGeneration";

/**
 * Steps in the activity-based session form
 */
export type ActivityBasedFormStep =
  | "basicInfo"
  | "initialStatus"
  | "activities"
  | "generalNotes"
  | "reportGeneration";
