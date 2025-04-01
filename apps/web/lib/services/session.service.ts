import { db, withDb } from "../db";
import { sessions } from "@praxisnotes/database";
import { insertSessionSchema } from "@praxisnotes/database";
import {
  SessionFormData,
  ActivityBasedSessionFormData,
} from "../types/SessionForm";
import { eq } from "drizzle-orm";

/**
 * Service for handling sessions in the database
 */
export const SessionService = {
  /**
   * Creates a new session from form data
   */
  async createSession(
    formData: SessionFormData | ActivityBasedSessionFormData,
    userId: string,
  ) {
    return withDb(async () => {
      const { basicInfo } = formData;

      const sessionData = {
        clientId: basicInfo.clientId,
        userId,
        sessionDate: new Date(basicInfo.sessionDate),
        startTime: new Date(`1970-01-01T${basicInfo.startTime}`),
        endTime: new Date(`1970-01-01T${basicInfo.endTime}`),
        location: basicInfo.location,
        isActivityBased: "activities" in formData,
        status: "draft",
      };

      // Validate session data
      insertSessionSchema.parse(sessionData);

      // Insert session
      const [newSession] = await db
        .insert(sessions)
        .values(sessionData)
        .returning();

      return newSession;
    });
  },

  /**
   * Gets a session by ID
   */
  async getSessionById(id: string) {
    return withDb(async () => {
      const session = await db.query.sessions.findFirst({
        where: eq(sessions.id, id),
        with: {
          client: true,
          user: true,
        },
      });

      return session;
    });
  },

  /**
   * Updates the status of a session
   */
  async updateSessionStatus(
    id: string,
    status: "draft" | "submitted" | "reviewed",
  ) {
    return withDb(async () => {
      const [updatedSession] = await db
        .update(sessions)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(sessions.id, id))
        .returning();

      return updatedSession;
    });
  },
};
