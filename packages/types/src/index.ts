// Export all types from their respective files

// Behavior types
export * from "./behavior/behavior.type";

// Options types
export * from "./options/option.type";

// Report types
export * from "./report/report.type";

// Skills types
export * from "./skills/skill.type";

// Generate types
export * from "./generate/generate.type";

// Common types
export * from "./common/response.type";
export * from "./common/error.type";
export * from "./common/api.type";
export * from "./common/form.type";

// Client types
export * from "./client/client.type";

// Reinforcement types
export * from "./reinforcement/reinforcement.type";

// Session form types
export * from "./session-form/session-form.type";

// Activity types - use explicit import to avoid naming conflicts
export type {
  Activity,
  ActivityWithRelations,
  NewActivity,
  UpdateActivity,
  ActivitiesFormData,
  ActivityBehavior,
  ActivityBehaviorForm,
  NewActivityBehavior,
  UpdateActivityBehavior,
  ActivityPrompt,
  ActivityPromptForm,
  NewActivityPrompt,
  UpdateActivityPrompt,
  ActivityReinforcement,
  ActivityReinforcementForm,
  NewActivityReinforcement,
  UpdateActivityReinforcement,
  PromptType,
  ActivityForm,
  ActivitySkill,
  NewActivitySkill,
  UpdateActivitySkill,
} from "./activity";

// NextAuth types
export * from "./next-auth/next-auth.type";
