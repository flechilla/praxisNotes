import { relations } from "drizzle-orm";
import { sessions } from "../session.table";
import { clients } from "../client.table";
import { users } from "../user.table";
import { reports } from "../report.table";
import { reinforcements } from "../reinforcement.table";
import { activities } from "../activity.table";
import { initialStatuses } from "../initial_status.table";
import { generalNotes } from "../general_notes.table";

/**
 * Session relations definition
 */
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
  reinforcements: many(reinforcements),
  activities: many(activities),
  initialStatus: one(initialStatuses),
  generalNotes: many(generalNotes),
}));
