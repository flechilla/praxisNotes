export type ActivitySkill = {
  id: string;
  activityId: string;
  skillId: string;
  promptLevel: string;
  trials: number;
  mastery: number;
  correct: number;
  incorrect: number;
  prompted: number;
  notes?: string;
};

export type NewActivitySkill = Omit<ActivitySkill, "id">;

export type UpdateActivitySkill = Partial<ActivitySkill>;
