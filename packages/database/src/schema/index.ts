// Export all schemas and types

// Organizations
export * from "./organization.table";

// Users and authentication
export * from "./user.table";
export * from "./role.table";

// Clients
export * from "./client.table";

// Relationship tables
export * from "./organization-user.table";
export * from "./user-role.table";
export * from "./user-client.table";

// Reports and Sessions
export * from "./session.table";
export * from "./report.table";
export * from "./report_section.table";

// Session data tracking
export * from "./skill_tracking.table";
// Export behavior tracking items while avoiding naming conflicts
export {
  behaviorTrackings,
  behaviorTrackingsRelations,
  insertBehaviorTrackingSchema,
  selectBehaviorTrackingSchema,
  // formatDuration and INTERVENTION_TYPES are exported explicitly
  formatDuration as behaviorTrackingFormatDuration,
  INTERVENTION_TYPES as behaviorTrackingInterventionTypes,
} from "./behavior_tracking.table";
export type {
  BehaviorTracking,
  BehaviorTrackingInsert,
} from "./behavior_tracking.table";
export * from "./reinforcement.table";
export * from "./general_notes.table";
export * from "./initial_status.table";

// Activity-based session tracking
// Export activity items while avoiding naming conflicts
export {
  activities,
  activitiesRelations,
  insertActivitySchema,
  selectActivitySchema,
  ACTIVITY_CATEGORIES,
  COMMON_LOCATIONS,
  // formatDuration is exported explicitly
  formatDuration as activityFormatDuration,
  generateActivitySummary,
} from "./activity.table";
export type { Activity, ActivityInsert } from "./activity.table";
// Export activity_behavior items while avoiding naming conflicts
export {
  activityBehaviors,
  activityBehaviorsRelations,
  insertActivityBehaviorSchema,
  selectActivityBehaviorSchema,
  // INTERVENTION_TYPES is exported explicitly
  INTERVENTION_TYPES as activityBehaviorInterventionTypes,
  parseInterventions,
  formatInterventions,
  summarizeBehaviorIntervention,
} from "./activity_behavior.table";
export type {
  ActivityBehavior,
  ActivityBehaviorInsert,
} from "./activity_behavior.table";
export * from "./activity_prompt.table";
export * from "./activity_reinforcement.table";

// Export enums
export * from "../enums";

// Note: Relations are now defined in each respective table file
