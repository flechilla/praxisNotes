import { NextRequest } from "next/server";
import { skillPrograms, skillTargets } from "../../../lib/mocks/skillsData";
import {
  createSuccessResponse,
  withApiMiddleware,
  validateQuery,
  z,
} from "../../../lib/api";

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

  // Simulate database operation delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Return data based on query parameters
  if (programId) {
    // If programId is provided, return targets for that program
    const targets = skillTargets.filter(
      (target) => target.programId === programId,
    );
    return createSuccessResponse({ targets });
  } else {
    // If no programId is provided, return all programs
    return createSuccessResponse({ programs: skillPrograms });
  }
}

// Apply middleware to our handler
export const GET = withApiMiddleware(getHandler);
