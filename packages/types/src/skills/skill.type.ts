/**
 * Represents a skill in the system
 */
export type Skill = {
  id: string;
  name: string;
  category: string;
  description?: string;
  targetAgeMin?: number;
  targetAgeMax?: number;
  difficulty?: SkillDifficulty;
  prerequisiteSkills?: string[];
  metadata?: Record<string, unknown>;
};

/**
 * Skill difficulty enum
 */
export enum SkillDifficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

/**
 * Represents a skill category
 */
export type SkillCategory = {
  id: string;
  name: string;
  description?: string;
};

/**
 * Represents a skill tracking record
 */
export type SkillTracking = {
  id: string;
  sessionId: string;
  skillId: string;
  skillName: string;
  status: SkillStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Skill status enum
 */
export enum SkillStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  MASTERED = "mastered",
  MAINTENANCE = "maintenance",
}

/**
 * Response structure for skill API requests
 */
export type SkillResponse = {
  skill?: Skill;
  skills?: Skill[];
  categories?: SkillCategory[];
  tracking?: SkillTracking[];
  error?: string;
};
