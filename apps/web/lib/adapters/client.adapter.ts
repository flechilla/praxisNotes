import { DBClient } from "../types/Client";
import { ClientInfo } from "../types/SessionForm";

/**
 * Adapts a database client to the ClientInfo format used by forms
 * @param dbClient The client data from the database
 * @returns ClientInfo formatted data
 */
export function adaptDBClientToClientInfo(dbClient: DBClient): ClientInfo {
  // Split the name into first and last name
  // This is a simplified approach; real implementation might need more sophisticated parsing
  const nameParts = dbClient.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    id: dbClient.id,
    firstName,
    lastName,
    dob: "", // These fields aren't in the DB schema yet
    guardian: "",
    diagnosis: "",
    provider: "",
    // Add more fields from notes if they become structured
  };
}

/**
 * Adapts multiple database clients to ClientInfo format
 * @param dbClients Array of clients from the database
 * @returns Array of ClientInfo formatted data
 */
export function adaptDBClientsToClientInfo(
  dbClients: DBClient[],
): ClientInfo[] {
  return dbClients.map(adaptDBClientToClientInfo);
}
