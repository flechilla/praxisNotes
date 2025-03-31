import { NextRequest, NextResponse } from "next/server";
import { Report } from "../../../../lib/types/Report";
import {
  SessionFormData,
  ActivityBasedSessionFormData,
} from "../../../../lib/types/SessionForm";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, createDataStreamResponse } from "ai";
import {
  createNarrativeReportPrompt,
  createLegacyReportPrompt,
} from "../../../../lib/prompts/sessionReport";
import { getClientById } from "../../../../lib/mocks/clientData";

// Function to check if form data is activity-based
const isActivityBased = (
  formData: SessionFormData | ActivityBasedSessionFormData
): formData is ActivityBasedSessionFormData => {
  return "activities" in formData && "initialStatus" in formData;
};

// Function to calculate session duration
const calculateSessionDuration = (
  startTime: string,
  endTime: string
): string => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const durationMs = end.getTime() - start.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );
  return `${durationHours > 0 ? `${durationHours} hour${durationHours > 1 ? "s" : ""}` : ""} ${durationMinutes} minute${durationMinutes > 1 ? "s" : ""}`.trim();
};

export async function POST(request: NextRequest) {
  console.log("Report generation API called");
  try {
    // Parse request body
    const body = await request.json();
    const {
      formData,
      rbtName,
      isActivityBased: forceActivityBased,
    } = body as {
      formData: SessionFormData | ActivityBasedSessionFormData;
      rbtName: string;
      isActivityBased?: boolean;
    };

    // Validate required fields
    if (!formData || !rbtName) {
      console.error("Report generation failed: Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: formData and rbtName are required" },
        { status: 400 }
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
          { status: 400 }
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
          { status: 400 }
        );
      }
    }

    // Get client information
    const client = getClientById(formData.basicInfo.clientId);
    if (!client) {
      console.error(
        `Report generation failed: Client not found (ID: ${formData.basicInfo.clientId})`
      );
      return NextResponse.json({ error: "Client not found" }, { status: 400 });
    }

    // Calculate session duration
    const sessionDuration = calculateSessionDuration(
      formData.basicInfo.startTime,
      formData.basicInfo.endTime
    );

    // Create prompt for AI based on form type
    let prompt: string;
    if (activityBasedForm) {
      prompt = createNarrativeReportPrompt(
        formData as ActivityBasedSessionFormData,
        client,
        rbtName,
        sessionDuration
      );
    } else {
      prompt = createLegacyReportPrompt(
        formData as SessionFormData,
        client,
        rbtName,
        sessionDuration
      );
    }

    // Create a base report with form data
    const baseReport: Omit<Report, "fullContent"> = {
      clientName: `${client.firstName} ${client.lastName}`,
      sessionDate: formData.basicInfo.sessionDate,
      sessionDuration,
      location: formData.basicInfo.location,
      rbtName,
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
      createdAt: new Date().toISOString(),
      status: "draft",
    };

    console.log(
      `Starting report generation for client: ${client.firstName} ${client.lastName}`
    );

    // Return the data stream response
    return createDataStreamResponse({
      execute: (dataStream) => {
        // Send base report to the client
        dataStream.writeData({ baseReport });

        // Generate the report
        const result = streamText({
          model: anthropic("claude-3-5-sonnet-20241022"),
          prompt,
        });

        // Merge the result into the data stream
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
      { status: 500 }
    );
  }
}
