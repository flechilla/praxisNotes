import { db } from "../client";

/**
 * Predefined behavior data for seeding the database
 */
export const behaviorSeedData = [
  {
    name: "Aggression",
    definition:
      "Physical actions directed at others that may cause harm, including hitting, kicking, biting, or pushing",
    category: "Challenging",
  },
  {
    name: "Self-injury",
    definition:
      "Actions directed toward self that may cause harm, such as head banging, biting self, or hitting self",
    category: "Challenging",
  },
  {
    name: "Property destruction",
    definition:
      "Behaviors that damage or destroy objects in the environment, such as throwing items, breaking objects, or tearing materials",
    category: "Challenging",
  },
  {
    name: "Elopement",
    definition: "Leaving a designated area without permission or supervision",
    category: "Safety",
  },
  {
    name: "Non-compliance",
    definition:
      "Refusing to follow instructions or complete requests within a reasonable time frame",
    category: "Instructional",
  },
  {
    name: "Tantrum",
    definition:
      "Combination of crying, screaming, falling to the floor, and other emotional expressions that persist for a period of time",
    category: "Emotional",
  },
  {
    name: "Verbal disruption",
    definition:
      "Inappropriate vocalizations including yelling, screaming, or using inappropriate language that disrupts the environment",
    category: "Disruptive",
  },
  {
    name: "Stereotypy",
    definition:
      "Repetitive movements or vocalizations that serve no apparent function in the current context",
    category: "Repetitive",
  },
  {
    name: "Food refusal",
    definition:
      "Consistently refusing to eat foods or entire food groups, pushing away food, or engaging in disruptive behaviors during mealtimes",
    category: "Eating",
  },
  {
    name: "Attention-seeking",
    definition:
      "Behaviors that appear to be maintained by gaining attention from others, including both appropriate and inappropriate means of seeking attention",
    category: "Social",
  },
];

/**
 * Seed the behaviors table with predefined data
 */
export async function seedBehaviors() {
  try {
    console.log("Seeding behaviors...");

    // Import behavior schema here to avoid circular dependencies
    const { behaviors } = await import("../schema/behavior.table");

    // Insert behaviors data
    await db.insert(behaviors).values(behaviorSeedData);

    console.log("Behaviors seeded successfully");
  } catch (error) {
    console.error("Error seeding behaviors:", error);
    throw error;
  }
}
