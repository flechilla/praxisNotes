import { db as dbClient, queryClient } from "@praxisnotes/database";
import { ErrorCode } from "@praxisnotes/types";

/**
 * Database error class for standardized error handling
 */
export class DatabaseError extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "DatabaseError";
    this.code = ErrorCode.DATABASE_ERROR;
    this.details = details;
  }
}

/**
 * Global shared database client instance
 */
export const db = dbClient;

/**
 * Execute a database operation with error handling
 * @param operation Function that performs database operations
 * @returns Result of the database operation
 */
export async function withDb<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error("Database operation failed:", error);

    throw new DatabaseError(
      error instanceof Error ? error.message : "Unknown database error",
      {
        originalError: error instanceof Error ? error.message : String(error),
      },
    );
  }
}

/**
 * Transaction context type
 */
export type TransactionContext = {
  tx: unknown;
};

/**
 * Execute a database transaction with error handling
 * @param operation Function that performs transactional database operations
 * @returns Result of the transaction
 */
export async function withTransaction<T>(
  operation: () => Promise<T>,
): Promise<T> {
  try {
    const result = await queryClient.transaction(async (tx: unknown) => {
      // Set the transaction context for the operation
      const txContext: TransactionContext = { tx };
      return await operation();
    });

    return result;
  } catch (error) {
    console.error("Database transaction failed:", error);

    throw new DatabaseError(
      error instanceof Error ? error.message : "Unknown transaction error",
      {
        originalError: error instanceof Error ? error.message : String(error),
      },
    );
  }
}

/**
 * Check if the database is connected and working
 * @returns True if the database is healthy
 */
export async function checkDbHealth(): Promise<boolean> {
  try {
    // Simple query to check database connectivity
    await queryClient.query(`SELECT 1`);
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}
