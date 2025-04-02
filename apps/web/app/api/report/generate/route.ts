import { NextRequest } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, createDataStreamResponse } from "ai";
import {
  createNarrativeReportPrompt,
  createLegacyReportPrompt,
} from "../../../../lib/prompts/sessionReport";
import { ClientService } from "../../../../lib/services/client.service";
import { SessionService } from "../../../../lib/services/session.service";
import { ReportService } from "../../../../lib/services/report.service";
import { db } from "../../../../lib/db";
import {
  activities,
  activityBehaviors,
  activityPrompts,
  activityReinforcements,
  initialStatuses,
  generalNotes,
  activitySkills,
} from "@praxisnotes/database";
import { SessionFormData } from "@praxisnotes/types";
import {
  withApiMiddleware,
  validateBody,
  createServerErrorResponse,
  createNotFoundResponse,
} from "../../../../lib/api";
import { reportGenerationSchema } from "../../../../lib/schemas/report.schema";
import { getSession } from "../../../../lib/auth";

/**
 * Calculates the duration between two time strings
 * @param startTime - Session start time in HH:MM format
 * @param endTime - Session end time in HH:MM format
 * @returns Formatted duration string (e.g. "1 hour 30 minutes")
 */
const calculateSessionDuration = (
  startTime: string,
  endTime: string,
): string => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const durationMs = end.getTime() - start.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60),
  );
  return `${durationHours > 0 ? `${durationHours} hour${durationHours > 1 ? "s" : ""}` : ""} ${durationMinutes} minute${durationMinutes > 1 ? "s" : ""}`.trim();
};

/**
 * Saves activity-based session data to the database
 * @param sessionId - The ID of the session
 * @param formData - The session form data
 */
const saveActivityBasedSessionData = async (
  sessionId: string,
  formData: SessionFormData,
): Promise<void> => {
  try {
    // Save initial status - using available fields from the schema
    await db.insert(initialStatuses).values({
      sessionId,
      caregiverReport: formData.initialStatus.caregiverReport,
      contextNotes: formData.initialStatus.initialResponse,
      physicalState: formData.initialStatus.medicationChanges,
      sessionReadiness: formData.initialStatus.clientStatus,
    });

    // Save general notes - one row per note type
    const generalNotesEntries = [
      {
        sessionId,
        title: "Session Notes",
        content: formData.generalNotes.sessionNotes,
        category: "general" as const,
      },
      {
        sessionId,
        title: "Caregiver Feedback",
        content: formData.generalNotes.caregiverFeedback,
        category: "caregiver" as const,
      },
      {
        sessionId,
        title: "Environmental Factors",
        content: formData.generalNotes.environmentalFactors,
        category: "environmental" as const,
      },
      {
        sessionId,
        title: "Next Session Focus",
        content: formData.generalNotes.nextSessionFocus,
        category: "general" as const,
      },
    ];

    // Use a transaction to ensure all notes are saved
    await Promise.all(
      generalNotesEntries.map((entry) => db.insert(generalNotes).values(entry)),
    );

    // Save activities and their related data
    for (const activity of formData.activities.activities) {
      // Insert activity
      const [newActivity] = await db
        .insert(activities)
        .values({
          sessionId,
          name: activity.name,
          description: activity.description,
          goal: activity.goal,
          location: activity.location,
          duration: activity.duration,
          completed: activity.completed,
          completionNotes: activity.completionNotes,
        })
        .returning();

      if (newActivity) {
        // Insert behaviors - use null for intensity if not a valid value
        for (const behavior of activity.behaviors || []) {
          // For intensity, map to exact literal type values
          const intensityMap = {
            "1 - mild": "1 - mild",
            "2 - moderate": "2 - moderate",
            "3 - significant": "3 - significant",
            "4 - severe": "4 - severe",
            "5 - extreme": "5 - extreme",
          } as const;

          const intensity =
            intensityMap[behavior.intensity as keyof typeof intensityMap] ||
            null;

          await db.insert(activityBehaviors).values({
            activityId: newActivity.id,
            intensity,
            interventionUsed: JSON.stringify(behavior.interventionUsed),
            interventionNotes: behavior.interventionNotes,
          });
        }

        // Insert prompts
        for (const prompt of activity.promptsUsed || []) {
          // Make sure the prompt type matches the enum
          const validPromptType =
            prompt.type === "Verbal" ||
            prompt.type === "Gestural" ||
            prompt.type === "Model" ||
            prompt.type === "Partial Physical" ||
            prompt.type === "Full Physical"
              ? prompt.type
              : "Verbal"; // Default to verbal if not matching

          await db.insert(activityPrompts).values({
            activityId: newActivity.id,
            promptType: validPromptType,
            frequency: prompt.count || 0,
          });
        }

        // Insert skills
        if (activity.skills && activity.skills.length > 0) {
          for (const skill of activity.skills) {
            // Make sure the prompt level matches one of the enum values
            const validPromptLevel =
              skill.promptLevel === "Independent" ||
              skill.promptLevel === "Verbal" ||
              skill.promptLevel === "Gestural" ||
              skill.promptLevel === "Model" ||
              skill.promptLevel === "Partial Physical" ||
              skill.promptLevel === "Full Physical"
                ? skill.promptLevel
                : "Independent"; // Default to Independent if not matching

            await db.insert(activitySkills).values({
              activityId: newActivity.id,
              skillId: skill.id,
              promptLevel: validPromptLevel,
              trials: skill.trials || 0,
              mastery: skill.mastery || 0,
              correct: skill.correct || 0,
              incorrect: skill.incorrect || 0,
              prompted: skill.prompted || 0,
              notes: skill.notes,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error saving activity-based session data:", error);
    throw error;
  }
};

/**
 * Type for metadata sent in the report response
 */
type ReportMetadata = {
  clientName: string;
  sessionDate: string;
  sessionDuration: string;
  location: string;
  rbtName: string;
};

/**
 * Handler for report generation requests
 */
async function postHandler(request: NextRequest) {
  console.log("Report generation API called");

  // Validate the request body
  const bodyResult = await validateBody(request, reportGenerationSchema);
  if (!bodyResult.success) {
    return bodyResult.response;
  }

  const { formData, rbtName, isActivityBased } = bodyResult.data;

  // Get the authenticated user's ID (middleware ensures auth)
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return createServerErrorResponse("User session information is missing");
  }

  try {
    // Get client information from the database
    const clientId = formData.basicInfo.clientId;
    const client = await ClientService.getClientInfoById(clientId);
    if (!client) {
      console.error(
        `Report generation failed: Client not found (ID: ${clientId})`,
      );
      return createNotFoundResponse("Client not found");
    }

    // Calculate session duration
    const sessionDuration = calculateSessionDuration(
      formData.basicInfo.startTime,
      formData.basicInfo.endTime,
    );

    // Save session to database - ensure it has the correct type
    const sessionFormData = formData as unknown as SessionFormData;
    const createdSession = await SessionService.createSession(
      sessionFormData,
      userId,
    );
    if (!createdSession) {
      console.error("Report generation failed: Session not created");
      return createServerErrorResponse("Failed to create session");
    }
    console.log(`Created session with ID: ${createdSession.id}`);

    // Save the detailed form data based on session type
    try {
      await saveActivityBasedSessionData(createdSession.id, sessionFormData);
    } catch (error) {
      console.error("Error saving detailed session data:", error);
      // Continue with report generation even if detailed data saving fails
    }

    // Create prompt for AI based on form type
    const prompt = createNarrativeReportPrompt(
      sessionFormData,
      client,
      rbtName,
      sessionDuration,
    );

    // Create basic metadata for the report
    const reportMetadata: ReportMetadata = {
      clientName: `${client.firstName} ${client.lastName}`,
      sessionDate: formData.basicInfo.sessionDate,
      sessionDuration,
      location: formData.basicInfo.location,
      rbtName,
    };

    console.log(
      `Starting report generation for client: ${client.firstName} ${client.lastName}`,
    );

    // Return the data stream response with the report
    return createDataStreamResponse({
      execute: (dataStream) => {
        // Send metadata to the client
        dataStream.writeData({ reportMetadata });

        const result = streamText({
          model: anthropic("claude-3-7-sonnet-20250219"),
          prompt,

          onFinish: async (result) => {
            // Save the report with the generated content
            try {
              const savedReport = await ReportService.createReport(
                createdSession.id,
                userId,
                clientId,
                {
                  clientName: reportMetadata.clientName,
                  sessionDate: reportMetadata.sessionDate,
                  sessionDuration: reportMetadata.sessionDuration,
                  location: reportMetadata.location,
                  rbtName: reportMetadata.rbtName,
                  summary: "",
                  skillAcquisition: {
                    title: "Skill Acquisition",
                    content: "",
                  },
                  behaviorManagement: {
                    title: "Behavior Management",
                    content: "",
                  },
                  reinforcement: {
                    title: "Reinforcement",
                    content: "",
                  },
                  observations: {
                    title: "Observations",
                    content: "",
                  },
                  recommendations: {
                    title: "Recommendations",
                    content: "",
                  },
                  nextSteps: {
                    title: "Next Steps",
                    content: "",
                  },
                  fullContent: result.text,
                },
              );

              console.log(result.text);

              if (savedReport) {
                console.log(`Saved report with ID: ${savedReport.id}`);
              } else {
                console.error("Failed to save report");
              }
            } catch (error) {
              console.error("Error saving report:", error);
            }
          },
        });

        result.mergeIntoDataStream(dataStream);
      },
      onError: (error) => {
        console.error("Error in report generation stream:", error);
        return error instanceof Error ? error.message : String(error);
      },
    });
  } catch (error) {
    console.error("Unhandled error in report generation:", error);
    return createServerErrorResponse(
      error instanceof Error ? error.message : "An unexpected error occurred",
    );
  }
}

/**
 * Export the route handler with API middleware
 */
export const POST = withApiMiddleware(postHandler, { requireAuth: true });
