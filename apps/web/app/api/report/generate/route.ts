import { NextRequest, NextResponse } from "next/server";
import { Report } from "../../../../lib/types/Report";
import { SessionFormData } from "../../../../lib/types/SessionForm";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, createDataStreamResponse } from "ai";
import { createReportPrompt } from "../../../../lib/utils/reportGeneration";
import { getClientById } from "../../../../lib/mocks/clientData";

export async function POST(request: NextRequest) {
  console.log("Report generation API called");
  try {
    // Parse request body
    const body = await request.json();
    const { formData, rbtName } = body as {
      formData: SessionFormData;
      rbtName: string;
    };

    // Validate required fields
    if (!formData || !rbtName) {
      console.error("Report generation failed: Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: formData and rbtName are required" },
        { status: 400 }
      );
    }

    // Validate form data structure
    if (
      !formData.basicInfo ||
      !formData.skillAcquisition ||
      !formData.behaviorTracking ||
      !formData.reinforcement ||
      !formData.generalNotes
    ) {
      console.error("Report generation failed: Incomplete form data");
      return NextResponse.json(
        { error: "Incomplete form data: all sections are required" },
        { status: 400 }
      );
    }

    // Create prompt for AI
    const prompt = createReportPrompt(formData, rbtName);

    // Prepare client information for the report object
    const client = getClientById(formData.basicInfo.clientId);
    if (!client) {
      console.error(
        `Report generation failed: Client not found (ID: ${formData.basicInfo.clientId})`
      );
      return NextResponse.json({ error: "Client not found" }, { status: 400 });
    }

    // Calculate session duration
    const startTime = new Date(`1970-01-01T${formData.basicInfo.startTime}`);
    const endTime = new Date(`1970-01-01T${formData.basicInfo.endTime}`);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor(
      (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    const sessionDuration =
      `${durationHours > 0 ? `${durationHours} hour${durationHours > 1 ? "s" : ""}` : ""} ${durationMinutes} minute${durationMinutes > 1 ? "s" : ""}`.trim();

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
          model: anthropic("claude-3-5-haiku-20241022"),
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
