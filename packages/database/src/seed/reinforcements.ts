import { db } from "../client";
import { reinforcements } from "../schema";
import { BaseReinforcement } from "../types/reinforcement.type";

const systemWideReinforcementsSeedData: BaseReinforcement[] = [
  // Social Reinforcers
  {
    name: "Verbal praise",
    type: "social",
    description:
      "Specific verbal expressions of approval for appropriate behaviors (e.g., 'Great job waiting your turn!')",
  },
  {
    name: "High-five",
    type: "social",
    description: "Physical gesture of approval and celebration",
  },
  {
    name: "Thumbs up",
    type: "social",
    description: "Visual gesture of approval",
  },
  {
    name: "Social attention",
    type: "social",
    description: "Focused attention and interaction from the therapist",
  },

  // Primary Reinforcers
  {
    name: "Preferred snack",
    type: "primary",
    description:
      "Client's favorite food items (subject to dietary restrictions and parent approval)",
  },
  {
    name: "Sensory toy",
    type: "primary",
    description:
      "Items providing sensory stimulation (e.g., fidget toys, stress balls)",
  },
  {
    name: "Bubble play",
    type: "primary",
    description:
      "Playing with bubbles - combines visual stimulation and social interaction",
  },

  // Secondary Reinforcers
  {
    name: "Stickers",
    type: "secondary",
    description: "Decorative stickers provided for task completion",
  },
  {
    name: "Token board",
    type: "token",
    description:
      "Token economy system where tokens are earned and exchanged for preferred items/activities",
  },

  // Activity Reinforcers
  {
    name: "Choice time",
    type: "activity",
    description: "Opportunity to choose preferred activity",
  },
  {
    name: "Break time",
    type: "activity",
    description: "Short period of free time between tasks",
  },
];

/**
 * Seeds the reinforcements table with initial data
 */
export async function seedReinforcements() {
  console.log("🌱 Seeding reinforcements...");

  try {
    // Insert all reinforcements with a default session ID
    // This is just for seeding purposes - in real usage, reinforcements will be associated with actual sessions
    for (const reinforcement of systemWideReinforcementsSeedData) {
      await db.insert(reinforcements).values({
        ...reinforcement,
      });
    }

    console.log("✅ Reinforcements seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding reinforcements:", error);
    throw error;
  }
}
