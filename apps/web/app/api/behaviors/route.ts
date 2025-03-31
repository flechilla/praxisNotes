import { NextRequest, NextResponse } from "next/server";
import { behaviors } from "../../../lib/mocks/behaviorsData";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const search = searchParams.get("search");

    // Simulate database operation delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return data based on query parameters
    if (id) {
      // If id is provided, return specific behavior
      const behavior = behaviors.find((b) => b.id === id);

      if (!behavior) {
        return NextResponse.json(
          { error: "Behavior not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ behavior }, { status: 200 });
    } else if (search) {
      // If search query is provided, filter behaviors
      const lowerSearch = search.toLowerCase();
      const filteredBehaviors = behaviors.filter(
        (b) =>
          b.name.toLowerCase().includes(lowerSearch) ||
          b.definition.toLowerCase().includes(lowerSearch)
      );

      return NextResponse.json(
        { behaviors: filteredBehaviors },
        { status: 200 }
      );
    } else {
      // If no parameters, return all behaviors
      return NextResponse.json({ behaviors }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching behaviors data:", error);
    return NextResponse.json(
      { error: "Failed to fetch behaviors data" },
      { status: 500 }
    );
  }
}
