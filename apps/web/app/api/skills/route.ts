import { NextRequest } from "next/server";
import {
  createSuccessResponse,
  withApiMiddleware,
  validateQuery,
  z,
} from "../../../lib/api";
import { db } from "@praxisnotes/database";
import { skills } from "@praxisnotes/database";
import { eq } from "drizzle-orm";

// Schema for validating query parameters
const getSkillsQuerySchema = z.object({
  programId: z.string().optional(),
});

// GET handler for skills
async function getHandler(request: NextRequest) {
  // Validate query parameters
  const queryResult = await validateQuery(request, getSkillsQuerySchema);
  if (!queryResult.success) {
    return queryResult.response;
  }

  const { programId } = queryResult.data;

  try {
    // If programId is provided, return skills for that program
    if (programId) {
      const skillTargets = await db.query.skills.findMany({
        where: eq(skills.program, programId),
      });

      return createSuccessResponse({ targets: skillTargets });
    } else {
      // If no programId is provided, return all distinct programs
      const skillPrograms = await db
        .select({
          id: skills.program,
          name: skills.program,
        })
        .from(skills)
        .groupBy(skills.program);

      return createSuccessResponse({ programs: skillPrograms });
    }
  } catch (error) {
    console.error("Error fetching skills data:", error);
    throw error;
  }
}

// Apply middleware to our handler
export const GET = withApiMiddleware(getHandler);
