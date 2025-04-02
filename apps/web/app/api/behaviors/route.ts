import { NextRequest, NextResponse } from "next/server";
import { db, withDb } from "../../../lib/db";
import { createApiResponse, withErrorHandling } from "../../../lib/errors";
import { eq, ilike, or } from "drizzle-orm";
import { ApiError, ErrorCode } from "@praxisnotes/types";

// Direct import from behavior table since it may not be exported from index
import { behaviors } from "@praxisnotes/database";

/**
 * GET handler for behaviors API
 * Supports querying behaviors by id, search term, or returning all behaviors
 */
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const search = searchParams.get("search");

  return await withDb(async () => {
    if (id) {
      // Validate UUID format
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidPattern.test(id)) {
        const error: ApiError = {
          code: ErrorCode.BAD_REQUEST,
          message: "Invalid behavior ID format",
        };
        return NextResponse.json({ error }, { status: 400 });
      }

      // If id is provided, return specific behavior
      const behavior = await db
        .select()
        .from(behaviors)
        .where(eq(behaviors.id, id))
        .limit(1);

      if (!behavior.length) {
        // Create a custom error response directly for more control
        const error: ApiError = {
          code: ErrorCode.NOT_FOUND,
          message: "Behavior not found",
        };

        // Using NextResponse directly since createApiResponse meta.error is not matching the type
        return NextResponse.json({ error }, { status: 404 });
      }

      return createApiResponse({ behavior: behavior[0] });
    } else if (search) {
      // Validate and sanitize search input
      if (search.trim().length === 0) {
        const error: ApiError = {
          code: ErrorCode.BAD_REQUEST,
          message: "Search term cannot be empty",
        };
        return NextResponse.json({ error }, { status: 400 });
      }

      // Use case-insensitive search with ilike for better pattern matching
      const searchPattern = `%${search.trim().toLowerCase()}%`;
      const filteredBehaviors = await db
        .select()
        .from(behaviors)
        .where(
          or(
            ilike(behaviors.name, searchPattern),
            ilike(behaviors.definition, searchPattern),
          ),
        );

      return createApiResponse({ behaviors: filteredBehaviors });
    } else {
      // If no parameters, return all behaviors
      const allBehaviors = await db.select().from(behaviors);
      return createApiResponse({ behaviors: allBehaviors });
    }
  });
});
