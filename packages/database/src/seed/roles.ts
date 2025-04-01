import { db } from "../client";
import { roles } from "../schema";
import { seed as seedDb } from "drizzle-seed";

/**
 * Seeds the roles table with default roles
 */
export async function seed() {
  console.log("🔑 Seeding roles...");

  try {
    await seedDb(db, { roles }, { count: 3 }).refine((f) => ({
      roles: {
        columns: {
          name: f.valuesFromArray({
            values: ["admin", "therapist", "supervisor"],
          }),
          description: f.valuesFromArray({
            values: [
              "Administrator with full system access",
              "Therapy provider who works directly with clients",
              "Supervisor who oversees therapists and reviews session reports",
            ],
          }),
        },
      },
    }));

    console.log("✅ Roles seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
    throw error;
  }
}
