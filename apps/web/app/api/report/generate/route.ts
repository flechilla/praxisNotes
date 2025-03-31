import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "../../../../lib/utils/reportGeneration";
import { Report } from "../../../../lib/types/Report";
import { SessionFormData } from "../../../../lib/types/SessionForm";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { formData, rbtName } = body as {
      formData: SessionFormData;
      rbtName: string;
    };

    // Validate required fields
    if (!formData || !rbtName) {
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
      return NextResponse.json(
        { error: "Incomplete form data: all sections are required" },
        { status: 400 }
      );
    }

    // Generate report using AI
    const report: Report = await generateReport(formData, rbtName);

    return NextResponse.json({ report }, { status: 200 });
  } catch (error) {
    console.error("Error generating report:", error);
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
