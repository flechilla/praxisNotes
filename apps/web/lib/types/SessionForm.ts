export type ClientInfo = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  guardian: string;
  diagnosis: string;
  provider: string;
};

export type BasicInfoFormData = {
  sessionDate: string;
  startTime: string;
  endTime: string;
  location: string;
  clientId: string;
};

export type Skill = {
  name: string;
  target: string;
  program: string;
  promptLevel: string;
  trials: number;
  mastery: number;
  notes: string;
  programId?: string;
  targetId?: string;
  programName?: string;
  correct?: number;
  prompted?: number;
  incorrect?: number;
};

export type SkillAcquisitionFormData = {
  skills: Skill[];
};

export type Behavior = {
  name: string;
  definition: string;
  frequency: number;
  duration: number;
  intensity: string;
  notes: string;
  behaviorId?: string;
  behaviorName?: string;
  antecedent?: string;
  consequence?: string;
  intervention?: string;
};

export type BehaviorTrackingFormData = {
  behaviors: Behavior[];
};

export type Reinforcer = {
  name: string;
  type: string;
  effectiveness: string;
  notes: string;
  reinforcerId?: string;
  reinforcerName?: string;
  reinforcerType?: string;
};

export type ReinforcementFormData = {
  reinforcers: Reinforcer[];
};

export type GeneralNotesFormData = {
  sessionNotes: string;
  caregiverFeedback: string;
  environmentalFactors: string;
  nextSessionFocus: string;
};

// New types for activity-based tracking
export type ActivityBehavior = {
  behaviorId?: string;
  behaviorName: string;
  definition?: string;
  intensity: string;
  interventionUsed: string[];
  interventionNotes?: string;
};

export type ActivityPrompt = {
  type: string; // "verbal", "gestural", "physical", etc.
  count: number;
};

export type ActivityReinforcement = {
  reinforcerId?: string;
  reinforcerName: string;
  type: string;
  notes?: string;
};

export type Activity = {
  id?: string;
  name: string;
  description: string;
  goal: string;
  location: string;
  duration?: number;
  behaviors: ActivityBehavior[];
  promptsUsed: ActivityPrompt[];
  completed: boolean;
  completionNotes?: string;
  reinforcement: ActivityReinforcement;
};

export type InitialStatusFormData = {
  clientStatus: string;
  caregiverReport: string;
  initialResponse: string;
  medicationChanges: string;
};

export type ActivitiesFormData = {
  activities: Activity[];
};

// Original SessionFormData (keep for backward compatibility)
export type SessionFormData = {
  basicInfo: BasicInfoFormData;
  skillAcquisition: SkillAcquisitionFormData;
  behaviorTracking: BehaviorTrackingFormData;
  reinforcement: ReinforcementFormData;
  generalNotes: GeneralNotesFormData;
};

// New SessionFormData for activity-based tracking
export type ActivityBasedSessionFormData = {
  basicInfo: BasicInfoFormData;
  initialStatus: InitialStatusFormData;
  activities: ActivitiesFormData;
  generalNotes: GeneralNotesFormData;
};

// Original FormStep (keep for backward compatibility)
export type FormStep =
  | "basicInfo"
  | "skillAcquisition"
  | "behaviorTracking"
  | "reinforcement"
  | "generalNotes"
  | "reportGeneration";

// New FormStep for activity-based tracking
export type ActivityBasedFormStep =
  | "basicInfo"
  | "initialStatus"
  | "activities"
  | "generalNotes"
  | "reportGeneration";
