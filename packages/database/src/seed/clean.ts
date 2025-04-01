import { db } from "../client";
import { queryClient } from "../client";

/**
 * Truncates all tables in the database
 * WARNING: Use only in development environments
 */
export async function cleanDatabase() {
  console.log("🧹 Cleaning database (truncating all tables)...");

  try {
    // Disable foreign key checks during truncation
    await queryClient`SET session_replication_role = 'replica';`;

    // Truncate all tables using raw SQL
    // List all tables in the public schema with a single truncate command
    await queryClient`
      TRUNCATE TABLE 
        users, 
        roles, 
        organizations, 
        clients, 
        organization_users, 
        user_roles, 
        user_clients, 
        sessions, 
        reports,
        report_sections,
        activities,
        skill_trackings,
        behavior_trackings,
        reinforcements,
        general_notes,
        initial_statuses,
        activity_behaviors,
        activity_prompts,
        activity_reinforcements
      CASCADE;
    `;

    // Re-enable foreign key checks
    await queryClient`SET session_replication_role = 'origin';`;

    console.log("✅ Database cleaned successfully");
  } catch (error) {
    console.error("❌ Error cleaning database:", error);
    throw error;
  } finally {
    // Close the connection
    await queryClient.end();
  }
}

// If this file is run directly in Node.js, clean the database
// This works with both ESM and CJS
if (
  (typeof require !== "undefined" && require.main === module) ||
  (typeof process !== "undefined" &&
    process.argv[1] &&
    process.argv[1].includes("clean"))
) {
  cleanDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Failed to clean database:", error);
      process.exit(1);
    });
}
