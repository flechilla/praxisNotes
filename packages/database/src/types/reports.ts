/**
 * Type definitions for report-related entities
 * These types define the structure of data for session reports in the PraxisNotes application
 */

// Base entity types with ID, timestamps, etc.
export type BaseEntity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

// Session status enum alternatives
export type SessionStatus = "draft" | "submitted" | "reviewed";

// Session entity for therapy sessions
export type Session = BaseEntity & {
  clientId: string;
  userId: string;
  sessionDate: Date;
  startTime: Date;
  endTime: Date;
  location: string;
  isActivityBased: boolean;
  status: SessionStatus;
};

// Report entity for session reports
export type Report = BaseEntity & {
  sessionId: string;
  userId: string;
  clientId: string;
  summary: string | null;
  fullContent: string;
  status: SessionStatus;
};

// Report section for structured reports
export type ReportSection = BaseEntity & {
  reportId: string;
  title: string;
  content: string;
  order: number;
};

// Skill tracking for session skills
export type SkillTracking = BaseEntity & {
  sessionId: string;
  name: string;
  target: string;
  program: string;
  promptLevel: string | null;
  trials: number;
  mastery: number;
  correct: number;
  prompted: number;
  incorrect: number;
  notes: string | null;
};

// Behavior tracking for client behaviors
export type BehaviorTracking = BaseEntity & {
  sessionId: string;
  name: string;
  definition: string | null;
  frequency: number;
  duration: number;
  intensity: string | null;
  antecedent: string | null;
  consequence: string | null;
  intervention: string | null;
  notes: string | null;
};

// Reinforcement tracking
export type Reinforcement = BaseEntity & {
  sessionId: string;
  name: string;
  type: string;
  effectiveness: string | null;
  notes: string | null;
};

// Activity for activity-based sessions
export type Activity = BaseEntity & {
  sessionId: string;
  name: string;
  description: string | null;
  goal: string | null;
  location: string | null;
  duration: number | null;
  completed: boolean;
  completionNotes: string | null;
};

// Activity behavior tracking
export type ActivityBehavior = BaseEntity & {
  activityId: string;
  behaviorName: string;
  definition: string | null;
  intensity: string | null;
  interventionUsed: string | null; // JSON string of intervention array
  interventionNotes: string | null;
};

// Activity prompt tracking
export type ActivityPrompt = BaseEntity & {
  activityId: string;
  type: string;
  count: number;
};

// Activity reinforcement
export type ActivityReinforcement = BaseEntity & {
  activityId: string;
  reinforcerName: string;
  type: string;
  notes: string | null;
};

// Initial client status for activity-based sessions
export type InitialStatus = BaseEntity & {
  sessionId: string;
  clientStatus: string | null;
  caregiverReport: string | null;
  initialResponse: string | null;
  medicationChanges: string | null;
};

// General session notes
export type GeneralNotes = BaseEntity & {
  sessionId: string;
  sessionNotes: string | null;
  caregiverFeedback: string | null;
  environmentalFactors: string | null;
  nextSessionFocus: string | null;
};
