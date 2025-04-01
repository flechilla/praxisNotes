import { db } from "../client";
import { organizations } from "../schema";
import { seed as seedDb } from "drizzle-seed";

/**
 * Seeds the organizations table with sample organizations
 */
export async function seed() {
  console.log("🏢 Seeding organizations...");

  try {
    // Create predefined organization data
    const orgNames = [
      "Praxis Therapy Center",
      "Behavioral Health Associates",
      "ABA Connect",
      "Autism Learning Partners",
      "Early Intervention Services",
    ];

    const orgSlugs = [
      "praxis-therapy-center",
      "behavioral-health-associates",
      "aba-connect",
      "autism-learning-partners",
      "early-intervention-services",
    ];

    await seedDb(db, { organizations }, { count: 5 }).refine((f) => ({
      organizations: {
        columns: {
          name: f.valuesFromArray({ values: orgNames }),
          slug: f.valuesFromArray({ values: orgSlugs }),
          description: f.loremIpsum({ sentencesCount: 3 }),
          logoUrl: f.valuesFromArray({
            values: [
              "https://placehold.co/200x200?text=Org1",
              "https://placehold.co/200x200?text=Org2",
              "https://placehold.co/200x200?text=Org3",
              "https://placehold.co/200x200?text=Org4",
              "https://placehold.co/200x200?text=Org5",
            ],
          }),
        },
      },
    }));

    console.log("✅ Organizations seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding organizations:", error);
    throw error;
  }
}
