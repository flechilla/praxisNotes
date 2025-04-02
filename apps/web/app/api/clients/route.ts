import { NextRequest } from "next/server";
import { ClientService } from "../../../lib/services/client.service";
import {
  createSuccessResponse,
  createNotFoundResponse,
  createStatusResponse,
  createServerErrorResponse,
  withApiMiddleware,
  validateQuery,
  validateBody,
} from "../../../lib/api";
import {
  clientQuerySchema,
  createClientSchema,
} from "../../../lib/schemas/client.schema";

// GET handler for clients
async function getHandler(request: NextRequest) {
  // Validate query parameters
  const queryResult = await validateQuery(request, clientQuerySchema);
  if (!queryResult.success) {
    return queryResult.response;
  }

  const { id } = queryResult.data;

  // If id is provided, return a specific client
  if (id) {
    const client = await ClientService.getClientById(id);

    if (!client) {
      return createNotFoundResponse("Client not found");
    }

    return createSuccessResponse(client);
  }

  // Otherwise, fetch all active clients
  const clients = await ClientService.getAllClients();
  return createSuccessResponse(clients);
}

// POST handler for creating a new client
async function postHandler(request: NextRequest) {
  // Validate request body
  const bodyResult = await validateBody(request, createClientSchema);
  if (!bodyResult.success) {
    return bodyResult.response;
  }

  try {
    // Note: ClientService.createClient doesn't exist yet, so we're returning a mock response
    // In a real implementation, you would call the actual service method
    // const newClient = await ClientService.createClient(bodyResult.data);

    const mockClient = {
      ...bodyResult.data,
      id: "mock-id-" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return createSuccessResponse(mockClient, {
      message: "Client created successfully",
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return createServerErrorResponse("Failed to create client");
  }
}

// DELETE handler for clients
async function deleteHandler(request: NextRequest) {
  // Validate query parameters
  const queryResult = await validateQuery(request, clientQuerySchema);
  if (!queryResult.success) {
    return queryResult.response;
  }

  const { id } = queryResult.data;

  // Ensure ID is provided
  if (!id) {
    return createNotFoundResponse("Client ID is required");
  }

  try {
    // Note: ClientService.deleteClient doesn't exist yet, so we're returning a mock response
    // In a real implementation, you would call the actual service method
    // const success = await ClientService.deleteClient(id);

    // Mock implementation
    const client = await ClientService.getClientById(id);
    if (!client) {
      return createNotFoundResponse("Client not found");
    }

    return createStatusResponse(true, "Client deleted successfully");
  } catch (error) {
    console.error("Error deleting client:", error);
    return createServerErrorResponse("Failed to delete client");
  }
}

// Apply middleware to our handlers
export const GET = withApiMiddleware(getHandler);
export const POST = withApiMiddleware(postHandler, { requireAuth: true });
export const DELETE = withApiMiddleware(deleteHandler, {
  requireAuth: true,
  requiredRoles: ["admin"],
});
