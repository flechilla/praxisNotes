import { NextRequest, NextResponse } from "next/server";
import { Report } from "@praxisnotes/types/src/Report";
import {
  SessionFormData,
  ActivityBasedSessionFormData,
} from "@praxisnotes/types/src/SessionForm";
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
  skillTrackings,
  behaviorTrackings,
  reinforcements,
  noteCategoryEnum,
  promptLevelEnum,
} from "@praxisnotes/database";
import { eq } from "drizzle-orm";

// Function to check if form data is activity-based
const isActivityBased = (
  formData: SessionFormData | ActivityBasedSessionFormData,
): formData is ActivityBasedSessionFormData => {
  return "activities" in formData && "initialStatus" in formData;
};

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
  formData: ActivityBasedSessionFormData,
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
            behaviorName: behavior.behaviorName,
            definition: behavior.definition,
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

        // Create a reinforcement with type defaulting to "other" if invalid
        const typeMap = {
          primary: "primary",
          secondary: "secondary",
          social: "social",
          token: "token",
          activity: "activity",
          other: "other",
        } as const;

        const type =
          typeMap[
            activity.reinforcement.type.toLowerCase() as keyof typeof typeMap
          ] || "other";

        const [newReinforcement] = await db
          .insert(reinforcements)
          .values({
            name: activity.reinforcement.reinforcerName,
            type,
            description: activity.reinforcement.notes,
          })
          .returning();

        if (newReinforcement) {
          // Then create the association
          await db.insert(activityReinforcements).values({
            activityId: newActivity.id,
            reinforcementId: newReinforcement.id,
          });
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
    for (const skill of formData.skillAcquisition.skills) {
      // Make sure the prompt level matches the enum
      const validPromptLevel =
        skill.promptLevel === "Independent" ||
        skill.promptLevel === "Verbal" ||
        skill.promptLevel === "Gestural" ||
        skill.promptLevel === "Model" ||
        skill.promptLevel === "Partial Physical" ||
        skill.promptLevel === "Full Physical"
          ? skill.promptLevel
          : "Verbal"; // Default to verbal if not matching

      await db.insert(skillTrackings).values({
        sessionId,
        skillName: skill.name, // Using skillName field from schema
        name: skill.name,
        target: skill.target,
        program: skill.program,
        promptLevel: validPromptLevel,
        trials: skill.trials,
        mastery: skill.mastery,
        notes: skill.notes,
      });
    }

    // Save behaviors
    for (const behavior of formData.behaviorTracking.behaviors) {
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

      await db.insert(behaviorTrackings).values({
        sessionId,
        behaviorName: behavior.name,
        definition: behavior.definition,
        frequency: behavior.frequency,
        duration: behavior.duration,
        intensity,
        notes: behavior.notes,
        antecedent: behavior.antecedent,
        consequence: behavior.consequence,
        interventionUsed: behavior.intervention,
      });
    }

    // Save reinforcers
    for (const reinforcer of formData.reinforcement.reinforcers) {
      const typeMap = {
        primary: "primary",
        secondary: "secondary",
        social: "social",
        token: "token",
        activity: "activity",
        other: "other",
      } as const;

      const type =
        typeMap[reinforcer.type.toLowerCase() as keyof typeof typeMap] ||
        "other";

      await db.insert(reinforcements).values({
        name: reinforcer.name,
        type,
        description: reinforcer.notes,
      });
    }
  } catch (error) {
    console.error("Error saving traditional session data:", error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  console.log("Report generation API called");
  try {
    // Parse request body
    const body = await request.json();
    console.log("Request body:", body);
    const {
      formData,
      rbtName,
      isActivityBased: forceActivityBased,
    } = body as {
      formData: SessionFormData | ActivityBasedSessionFormData;
      rbtName: string;
      isActivityBased?: boolean;
    };

    const userId = "7a3de2f7-5ff7-49d1-9b93-a5101dcc7fc4";

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

    // Determine if the form data is activity-based
    const activityBasedForm = forceActivityBased || isActivityBased(formData);

    // Validate form data structure based on its type
    if (activityBasedForm) {
      const activityForm = formData as ActivityBasedSessionFormData;
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
    } else {
      const standardForm = formData as SessionFormData;
      if (
        !standardForm.basicInfo ||
        !standardForm.skillAcquisition ||
        !standardForm.behaviorTracking ||
        !standardForm.reinforcement ||
        !standardForm.generalNotes
      ) {
        console.error("Report generation failed: Incomplete form data");
        return NextResponse.json(
          { error: "Incomplete form data: all sections are required" },
          { status: 400 },
        );
      }
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
      if (activityBasedForm) {
        await saveActivityBasedSessionData(
          session.id,
          formData as ActivityBasedSessionFormData,
        );
      } else {
        await saveTraditionalSessionData(
          session.id,
          formData as SessionFormData,
        );
      }
    } catch (error) {
      console.error("Error saving detailed session data:", error);
      // Continue with report generation even if detailed data saving fails
    }

    // Create prompt for AI based on form type
    let prompt: string;
    if (activityBasedForm) {
      prompt = createNarrativeReportPrompt(
        formData as ActivityBasedSessionFormData,
        client,
        rbtName,
        sessionDuration,
      );
    } else {
      prompt = createLegacyReportPrompt(
        formData as SessionFormData,
        client,
        rbtName,
        sessionDuration,
      );
    }

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
