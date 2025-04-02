import { BaseReinforcement } from "../types/reinforcement.type";

/**
 * Seed data for reinforcements
 * These are base reinforcements that are available system-wide (organizationId = null)
 */
export const systemWideReinforcementsSeedData: BaseReinforcement[] = [
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
 * Example organization-specific reinforcements
 * These will be used to seed initial organization-specific reinforcements
 * Organizations can later add their own custom reinforcements
 */
export const organizationSpecificReinforcementsSeedData: Omit<
  BaseReinforcement & { organizationId: string },
  "frequency" | "effectiveness" | "notes"
>[] = [
  {
    organizationId: "ORGANIZATION_ID_1", // This will be replaced with actual org ID during seeding
    name: "Special Friday Activity",
    type: "activity",
    description: "Organization-specific end-of-week reward activity",
  },
  {
    organizationId: "ORGANIZATION_ID_1",
    name: "Organization Points System",
    type: "token",
    description: "Custom point system specific to this organization",
  },
  {
    organizationId: "ORGANIZATION_ID_2",
    name: "Team Challenge Rewards",
    type: "activity",
    description: "Group-based reinforcement system",
  },
];
