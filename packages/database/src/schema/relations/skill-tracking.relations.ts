import { relations } from "drizzle-orm";
import { skillTrackings } from "../skill.table";
import { sessions } from "../session.table";

/**
 * Skill tracking relations definition
 */
export const skillTrackingRelations = relations(skillTrackings, ({ one }) => ({
  session: one(sessions, {
    fields: [skillTrackings.sessionId],
    references: [sessions.id],
  }),
}));
