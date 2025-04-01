import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";
import * as schema from "./schema";

// Validate environment variable
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Database connection URL from environment
const connectionString = process.env.DATABASE_URL;

// Create a Postgres client for use with Drizzle
export const queryClient = postgres(connectionString);

// Create Drizzle client
export const db = drizzle(queryClient, { schema });
