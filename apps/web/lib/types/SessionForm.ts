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

export type SessionFormData = {
  basicInfo: BasicInfoFormData;
  skillAcquisition: SkillAcquisitionFormData;
  behaviorTracking: BehaviorTrackingFormData;
  reinforcement: ReinforcementFormData;
  generalNotes: GeneralNotesFormData;
};

export type FormStep =
  | "basicInfo"
  | "skillAcquisition"
  | "behaviorTracking"
  | "reinforcement"
  | "generalNotes"
  | "reportGeneration";
