import { NextRequest } from "next/server";
import {
  createSuccessResponse,
  createNotFoundResponse,
  createServerErrorResponse,
  withApiMiddleware,
  validateQuery,
} from "../../../lib/api";
import { getSession } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { reports } from "@praxisnotes/database";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";

// Schema for validating query parameters
const reportsQuerySchema = z.object({
  id: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
});

// GET handler for reports
async function getHandler(request: NextRequest) {
  try {
    // Validate query parameters
    const queryResult = await validateQuery(request, reportsQuerySchema);
    if (!queryResult.success) {
      return queryResult.response;
    }

    const { id, limit } = queryResult.data;

    // Get the authenticated user's ID
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return createServerErrorResponse("User session information is missing");
    }

    // If id is provided, return a specific report
    if (id) {
      const report = await db.query.reports.findFirst({
        where: and(eq(reports.id, id), eq(reports.userId, userId)),
        with: {
          client: true,
          session: true,
          sections: {
            orderBy: (sections, { asc }) => [asc(sections.order)],
          },
        },
      });

      if (!report) {
        return createNotFoundResponse("Report not found");
      }

      return createSuccessResponse(report);
    }

    // Otherwise, fetch all reports for the user
    const userReports = await db.query.reports.findMany({
      where: eq(reports.userId, userId),
      with: {
        client: true,
        session: true,
      },
      limit,
      orderBy: [desc(reports.updatedAt)],
    });

    // Transform to a format suitable for display in the UI
    const formattedReports = userReports.map((report) => ({
      id: report.id,
      clientName: `${report.client.firstName} ${report.client.lastName}`,
      date: report.session.sessionDate.toISOString().split("T")[0],
      status: report.status,
      summary: report.summary || "No summary available",
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    }));

    return createSuccessResponse(formattedReports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return createServerErrorResponse("Failed to fetch reports");
  }
}

export const GET = withApiMiddleware(getHandler);
