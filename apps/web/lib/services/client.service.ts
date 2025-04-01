import { ClientInfo } from "../types/SessionForm";
import { DBClient } from "../types/Client";
import {
  adaptDBClientToClientInfo,
  adaptDBClientsToClientInfo,
} from "../adapters/client.adapter";

// Server-side imports - only used in API routes
let db: any;
let clients: any;
let eq: any;
let desc: any;
let withDb: any;

// Only import database modules on the server
if (typeof window === "undefined") {
  // Import required modules for server-side
  const dbModule = require("../db");
  const dbSchemaModule = require("@praxisnotes/database");
  const drizzleModule = require("drizzle-orm");

  db = dbModule.db;
  withDb = dbModule.withDb;
  clients = dbSchemaModule.clients;
  eq = drizzleModule.eq;
  desc = drizzleModule.desc;
}

/**
 * Client Service - Handles client data operations
 */
export class ClientService {
  /**
   * Get all clients
   * @returns Array of database client objects
   */
  static async getAllClients(): Promise<DBClient[]> {
    // If running on the server (in API route)
    if (typeof window === "undefined") {
      return withDb(async () => {
        const result = await db
          .select()
          .from(clients)
          .where(eq(clients.isActive, true))
          .orderBy(desc(clients.updatedAt))
          .limit(10);

        return result;
      });
    }

    // If running in the browser
    try {
      const response = await fetch("/api/clients");

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      return data.map((client: any) => ({
        ...client,
        createdAt: new Date(client.createdAt),
        updatedAt: new Date(client.updatedAt),
      }));
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  }

  /**
   * Get all clients in ClientInfo format
   * @returns Array of clients in ClientInfo format
   */
  static async getAllClientInfos(): Promise<ClientInfo[]> {
    const dbClients = await this.getAllClients();
    return adaptDBClientsToClientInfo(dbClients);
  }

  /**
   * Get a client by ID
   * @param id Client ID
   * @returns Client data or null if not found
   */
  static async getClientById(id: string): Promise<DBClient | null> {
    // If running on the server (in API route)
    if (typeof window === "undefined") {
      return await withDb(async () => {
        const result = await db
          .select()
          .from(clients)
          .where(eq(clients.id, id))
          .limit(1);

        if (result.length === 0) {
          return null;
        }

        return result[0] as DBClient;
      });
    }

    // If running in the browser
    try {
      const response = await fetch(`/api/clients?id=${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch client");
      }

      const data = await response.json();
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      return null;
    }
  }

  /**
   * Get a client by ID and convert to ClientInfo format
   * @param id Client ID
   * @returns ClientInfo formatted data
   */
  static async getClientInfoById(id: string): Promise<ClientInfo | null> {
    const client = await this.getClientById(id);
    if (!client) return null;

    return adaptDBClientToClientInfo(client);
  }
}
