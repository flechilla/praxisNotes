import { NextRequest, NextResponse } from "next/server";
import { ClientService } from "../../../lib/services/client.service";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // If id is provided, return a specific client
    if (id) {
      const client = await ClientService.getClientById(id);

      if (!client) {
        return NextResponse.json(
          { error: "Client not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(client);
    }

    // Otherwise, fetch all active clients
    const clients = await ClientService.getAllClients();
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 },
    );
  }
}
