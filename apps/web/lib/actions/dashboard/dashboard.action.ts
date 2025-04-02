"use server";

import { db } from "../../db";
import { sessions, reports, clients } from "@praxisnotes/database";
import { desc, eq, and, gte, sql } from "drizzle-orm";
import { getSession } from "../../auth";

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Get total active clients count
  const clientsCount = await db
    .select({ count: sql`COUNT(*)` })
    .from(clients)
    .where(eq(clients.isActive, true));

  // Get recent sessions count (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sessionsCount = await db
    .select({ count: sql`COUNT(*)` })
    .from(sessions)
    .where(
      and(
        eq(sessions.userId, userId),
        gte(sessions.sessionDate, thirtyDaysAgo),
      ),
    );

  // Get draft reports count
  const draftReportsCount = await db
    .select({ count: sql`COUNT(*)` })
    .from(reports)
    .where(and(eq(reports.userId, userId), eq(reports.status, "draft")));

  // Get completed reports count
  const completedReportsCount = await db
    .select({ count: sql`COUNT(*)` })
    .from(reports)
    .where(and(eq(reports.userId, userId), eq(reports.status, "reviewed")));

  return {
    activeClients: Number(clientsCount[0]?.count || 0),
    recentSessions: Number(sessionsCount[0]?.count || 0),
    draftReports: Number(draftReportsCount[0]?.count || 0),
    completedReports: Number(completedReportsCount[0]?.count || 0),
  };
}

/**
 * Get upcoming sessions
 */
export async function getUpcomingSessions(limit = 5) {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingSessions = await db.query.sessions.findMany({
    where: and(eq(sessions.userId, userId), gte(sessions.sessionDate, today)),
    with: {
      client: true,
    },
    limit,
    orderBy: [sessions.sessionDate],
  });

  return upcomingSessions.map((session) => ({
    id: session.id,
    clientName: session.client.name,
    date: formatUpcomingDate(session.sessionDate),
    time: formatTime(session.startTime),
    location: session.location,
  }));
}

/**
 * Get recent reports
 */
export async function getRecentReports(limit = 5) {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const recentReports = await db.query.reports.findMany({
    where: eq(reports.userId, userId),
    with: {
      client: true,
      session: true,
    },
    limit,
    orderBy: [desc(reports.updatedAt)],
  });

  return recentReports.map((report) => ({
    id: report.id,
    clientName: report.client.name,
    date: formatDate(report.session.sessionDate),
    status: report.status,
    summary: report.summary || "No summary available",
  }));
}

// Helper functions for date formatting
function formatUpcomingDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateToCheck = new Date(date);
  dateToCheck.setHours(0, 0, 0, 0);

  if (dateToCheck.getTime() === today.getTime()) {
    return "Today";
  } else if (dateToCheck.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else {
    return formatDate(date);
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
