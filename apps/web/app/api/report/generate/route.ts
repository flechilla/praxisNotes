import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, generateText, createDataStreamResponse } from "ai";
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
import { getSession } from "../../../../lib/auth";

// Function to calculate session duration
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

// Save activity-based session data
const saveActivityBasedSessionData = async (
  sessionId: string,
  formData: SessionFormData,
) => {
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
    await db.insert(generalNotes).values({
      sessionId,
      title: "Session Notes",
      content: formData.generalNotes.sessionNotes,
      category: "general",
    });

    await db.insert(generalNotes).values({
      sessionId,
      title: "Caregiver Feedback",
      content: formData.generalNotes.caregiverFeedback,
      category: "caregiver",
    });

    await db.insert(generalNotes).values({
      sessionId,
      title: "Environmental Factors",
      content: formData.generalNotes.environmentalFactors,
      category: "environmental",
    });

    await db.insert(generalNotes).values({
      sessionId,
      title: "Next Session Focus",
      content: formData.generalNotes.nextSessionFocus,
      category: "general",
    });

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
        for (const behavior of activity.behaviors) {
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
        for (const prompt of activity.promptsUsed) {
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
            frequency: prompt.count,
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

// Save traditional session data
const saveTraditionalSessionData = async (
  sessionId: string,
  formData: SessionFormData,
) => {
  try {
    // Save general notes - one row per note type
    await db.insert(generalNotes).values({
      sessionId,
      title: "Session Notes",
      content: formData.generalNotes.sessionNotes,
      category: "general",
    });

    await db.insert(generalNotes).values({
      sessionId,
      title: "Caregiver Feedback",
      content: formData.generalNotes.caregiverFeedback,
      category: "caregiver",
    });

    await db.insert(generalNotes).values({
      sessionId,
      title: "Environmental Factors",
      content: formData.generalNotes.environmentalFactors,
      category: "environmental",
    });

    await db.insert(generalNotes).values({
      sessionId,
      title: "Next Session Focus",
      content: formData.generalNotes.nextSessionFocus,
      category: "general",
    });

    // Save skills
    for (const activity of formData.activities.activities) {
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
          activityId: activity.id,
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

    // Save behaviors
    for (const activity of formData.activities.activities) {
      for (const behavior of activity.behaviors) {
        // For intensity, map to exact literal type values
        const intensityMap = {
          "1 - mild": "1 - mild",
          "2 - moderate": "2 - moderate",
          "3 - significant": "3 - significant",
          "4 - severe": "4 - severe",
          "5 - extreme": "5 - extreme",
        } as const;

        const intensity =
          intensityMap[behavior.intensity as keyof typeof intensityMap] || null;

        await db.insert(activityBehaviors).values({
          activityId: activity.id,
          intensity,
          interventionUsed: JSON.stringify(behavior.interventionUsed),
          interventionNotes: behavior.interventionNotes,
        });
      }
    }

    // Save reinforcers
    for (const activity of formData.activities.activities) {
      for (const reinforcer of activity.reinforcement) {
        await db.insert(activityReinforcements).values({
          activityId: activity.id,
          reinforcementId: reinforcer.reinforcerId,
          effectiveness: reinforcer.effectiveness,
          notes: reinforcer.notes,
        });
      }
    }
  } catch (error) {
    console.error("Error saving traditional session data:", error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  console.log("Report generation API called");

  const authSession = await getSession();
  if (!authSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse request body
    const body = await request.json();
    console.log("Request body:", body);
    const {
      formData,
      rbtName,
      isActivityBased: forceActivityBased,
    } = body as {
      formData: SessionFormData;
      rbtName: string;
      isActivityBased?: boolean;
    };

    const userId = authSession.user?.id;

    // Validate required fields
    if (!formData || !rbtName) {
      console.error("Report generation failed: Missing required fields");
      return NextResponse.json(
        {
          error:
            "Missing required fields: formData, rbtName, and userId are required",
        },
        { status: 400 },
      );
    }

    // Validate form data structure based on its type
    const activityForm = formData as SessionFormData;
    if (
      !activityForm.basicInfo ||
      !activityForm.initialStatus ||
      !activityForm.activities ||
      !activityForm.generalNotes
    ) {
      console.error("Report generation failed: Incomplete form data");
      return NextResponse.json(
        { error: "Incomplete form data: all sections are required" },
        { status: 400 },
      );
    }

    // Get client information from the database
    const clientId = formData.basicInfo.clientId;
    const client = await ClientService.getClientInfoById(clientId);
    if (!client) {
      console.error(
        `Report generation failed: Client not found (ID: ${clientId})`,
      );
      return NextResponse.json({ error: "Client not found" }, { status: 400 });
    }

    // Calculate session duration
    const sessionDuration = calculateSessionDuration(
      formData.basicInfo.startTime,
      formData.basicInfo.endTime,
    );

    // Save session to database
    const session = await SessionService.createSession(formData, userId);
    if (!session) {
      console.error("Report generation failed: Session not created");
      return NextResponse.json(
        { error: "Session not created" },
        { status: 400 },
      );
    }
    console.log(`Created session with ID: ${session.id}`);

    // Save the detailed form data based on session type
    try {
      await saveActivityBasedSessionData(
        session.id,
        formData as SessionFormData,
      );
    } catch (error) {
      console.error("Error saving detailed session data:", error);
      // Continue with report generation even if detailed data saving fails
    }

    // Create prompt for AI based on form type
    let prompt: string;
    prompt = createNarrativeReportPrompt(
      formData as SessionFormData,
      client,
      rbtName,
      sessionDuration,
    );

    // Create basic metadata for the report
    const reportMetadata = {
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
          model: anthropic("claude-3-5-sonnet-20241022"),
          prompt,
          onFinish: async (result) => {
            // Save the report with the generated content
            try {
              const savedReport = await ReportService.createReport(
                session.id,
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
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
