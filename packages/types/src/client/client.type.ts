/**
 * Client type definitions
 * These types represent clients in the system and are used across the application
 */

/**
 * Base client type with common properties
 */
export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  organizationId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Client type for creating a new client
 * Omits system-generated fields
 */
export type NewClient = Omit<Client, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Client type for updating an existing client
 * All fields are optional except id
 */
export type UpdateClient = Partial<Omit<Client, "id">> & {
  id: string;
};

/**
 * Client with minimal information
 * Used for dropdowns and simple lists
 */
export type ClientSummary = Pick<
  Client,
  "id" | "firstName" | "lastName" | "isActive"
>;

/**
 * Client search parameters
 */
export type ClientSearchParams = {
  search?: string;
  isActive?: boolean;
  organizationId?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof Client;
  sortOrder?: "asc" | "desc";
};
