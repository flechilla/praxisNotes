import { NextRequest, NextResponse } from "next/server";
import { skillPrograms, skillTargets } from "../../../lib/mocks/skillsData";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get("programId");

    // Simulate database operation delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return data based on query parameters
    if (programId) {
      // If programId is provided, return targets for that program
      const targets = skillTargets.filter(
        (target) => target.programId === programId
      );
      return NextResponse.json({ targets }, { status: 200 });
    } else {
      // If no programId is provided, return all programs
      return NextResponse.json({ programs: skillPrograms }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching skills data:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills data" },
      { status: 500 }
    );
  }
}
