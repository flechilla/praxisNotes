import { seed as seedRoles } from "./roles";
import { seed as seedOrganizations } from "./organizations";
import { seed as seedUsers } from "./users";
import { seed as seedClients } from "./clients";
import { seed as seedSessions } from "./sessions";
import { db } from "../client";
import { seed, reset } from "drizzle-seed";
import * as schema from "../schema";

// Export individual seed functions
export { seedRoles, seedOrganizations, seedUsers, seedClients, seedSessions };

/**
 * Main function to seed all data
 */
export async function seedAll() {
  console.log("🌱 Seeding database...");

  try {
    // Reset database first to start fresh
    console.log("🧹 Resetting database...");
    await reset(db, schema);

    // Seed all tables
    await seedRoles();
    await seedOrganizations();
    await seedUsers();
    await seedClients();
    await seedSessions();

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// If this file is run directly in Node.js, seed the database
// This works with both ESM and CJS
if (
  (typeof require !== "undefined" && require.main === module) ||
  (typeof process !== "undefined" &&
    process.argv[1] &&
    process.argv[1].includes("seed/index"))
) {
  seedAll()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Failed to seed database:", error);
      process.exit(1);
    });
}
