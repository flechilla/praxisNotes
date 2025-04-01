import { relations } from "drizzle-orm";
import { users } from "./user.table";
import { clients } from "./client.table";
import { sessions } from "./session.table";
import { reports } from "./report.table";
import { reportSections } from "./report_section.table";
import { skillTrackings } from "./skill_tracking.table";
import { behaviorTrackings } from "./behavior_tracking.table";
import { reinforcements } from "./reinforcement.table";
import { activities } from "./activity.table";
import { activityBehaviors } from "./activity_behavior.table";
import { activityPrompts } from "./activity_prompt.table";
import { activityReinforcements } from "./activity_reinforcement.table";
import { initialStatuses } from "./initial_status.table";
import { generalNotes } from "./general_notes.table";

/**
 * Define all relations between tables using Drizzle's relations API
 */

// User relations
export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  reports: many(reports),
  clients: many(clients),
}));

// Client relations
export const clientRelations = relations(clients, ({ many }) => ({
  sessions: many(sessions),
  reports: many(reports),
}));

// Session relations
export const sessionRelations = relations(sessions, ({ one, many }) => ({
  client: one(clients, {
    fields: [sessions.clientId],
    references: [clients.id],
  }),
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  reports: many(reports),
  skillTrackings: many(skillTrackings),
  behaviorTrackings: many(behaviorTrackings),
  reinforcements: many(reinforcements),
  activities: many(activities),
  initialStatus: one(initialStatuses),
  generalNotes: many(generalNotes),
}));

// Report relations
export const reportRelations = relations(reports, ({ one, many }) => ({
  session: one(sessions, {
    fields: [reports.sessionId],
    references: [sessions.id],
  }),
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [reports.clientId],
    references: [clients.id],
  }),
  sections: many(reportSections),
}));

// Report section relations
export const reportSectionRelations = relations(reportSections, ({ one }) => ({
  report: one(reports, {
    fields: [reportSections.reportId],
    references: [reports.id],
  }),
}));

// Skill tracking relations
export const skillTrackingRelations = relations(skillTrackings, ({ one }) => ({
  session: one(sessions, {
    fields: [skillTrackings.sessionId],
    references: [sessions.id],
  }),
}));

// Behavior tracking relations
export const behaviorTrackingRelations = relations(
  behaviorTrackings,
  ({ one }) => ({
    session: one(sessions, {
      fields: [behaviorTrackings.sessionId],
      references: [sessions.id],
    }),
  }),
);

// Reinforcement relations
export const reinforcementRelations = relations(reinforcements, ({ one }) => ({
  session: one(sessions, {
    fields: [reinforcements.sessionId],
    references: [sessions.id],
  }),
}));

// Activity relations
export const activityRelations = relations(activities, ({ one, many }) => ({
  session: one(sessions, {
    fields: [activities.sessionId],
    references: [sessions.id],
  }),
  behaviors: many(activityBehaviors),
  prompts: many(activityPrompts),
  reinforcement: one(activityReinforcements),
}));

// Activity behavior relations
export const activityBehaviorRelations = relations(
  activityBehaviors,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityBehaviors.activityId],
      references: [activities.id],
    }),
  }),
);

// Activity prompt relations
export const activityPromptRelations = relations(
  activityPrompts,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityPrompts.activityId],
      references: [activities.id],
    }),
  }),
);

// Activity reinforcement relations
export const activityReinforcementRelations = relations(
  activityReinforcements,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityReinforcements.activityId],
      references: [activities.id],
    }),
  }),
);

// Initial status relations
export const initialStatusRelations = relations(initialStatuses, ({ one }) => ({
  session: one(sessions, {
    fields: [initialStatuses.sessionId],
    references: [sessions.id],
  }),
}));

// General notes relations
export const generalNoteRelations = relations(generalNotes, ({ one }) => ({
  session: one(sessions, {
    fields: [generalNotes.sessionId],
    references: [sessions.id],
  }),
}));
