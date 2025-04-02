import { NextRequest, NextResponse } from "next/server";
import { db, withDb } from "../../../lib/db";
import { createApiResponse, withErrorHandling } from "../../../lib/errors";
import { eq, ilike, or, isNull, and } from "drizzle-orm";
import { ApiError, ErrorCode } from "@praxisnotes/types";
import { reinforcements } from "@praxisnotes/database";

/**
 * GET handler for reinforcements API
 * Supports querying reinforcements by id, organization id, search term, or returning all reinforcements
 * If no organization id is provided, returns only system-wide reinforcements
 */
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const search = searchParams.get("search");
  const organizationId = searchParams.get("organizationId");

  return await withDb(async () => {
    // If id is provided, return specific reinforcement
    if (id) {
      // Validate UUID format
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidPattern.test(id)) {
        const error: ApiError = {
          code: ErrorCode.BAD_REQUEST,
          message: "Invalid reinforcement ID format",
        };
        return NextResponse.json({ error }, { status: 400 });
      }

      const reinforcement = await db
        .select()
        .from(reinforcements)
        .where(eq(reinforcements.id, id))
        .execute();

      if (!reinforcement.length) {
        const error: ApiError = {
          code: ErrorCode.NOT_FOUND,
          message: "Reinforcement not found",
        };
        return NextResponse.json({ error }, { status: 404 });
      }

      // Check if user has access to this reinforcement
      const result = reinforcement[0];
      if (
        result?.organizationId &&
        organizationId &&
        result.organizationId !== organizationId
      ) {
        const error: ApiError = {
          code: ErrorCode.FORBIDDEN,
          message: "Access to this reinforcement is not allowed",
        };
        return NextResponse.json({ error }, { status: 403 });
      }

      return createApiResponse({ reinforcement: result });
    }

    // Build the query with conditions
    const conditions = [];

    // Add search conditions if provided
    if (search?.trim()) {
      const searchPattern = `%${search.trim().toLowerCase()}%`;
      conditions.push(
        or(
          ilike(reinforcements.name, searchPattern),
          ilike(reinforcements.description, searchPattern),
        ),
      );
    }

    // Add organization filter
    if (organizationId) {
      // Return system-wide reinforcements and organization-specific ones
      conditions.push(
        or(
          isNull(reinforcements.organizationId),
          eq(reinforcements.organizationId, organizationId),
        ),
      );
    } else {
      // Return only system-wide reinforcements
      conditions.push(isNull(reinforcements.organizationId));
    }

    // Execute the query with all conditions
    const results = await db
      .select()
      .from(reinforcements)
      .where(conditions.length === 1 ? conditions[0] : and(...conditions))
      .execute();

    return createApiResponse({ reinforcements: results });
  });
});
