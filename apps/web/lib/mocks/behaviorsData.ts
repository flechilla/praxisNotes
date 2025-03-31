export type BehaviorOption = {
  id: string;
  name: string;
  definition: string;
  category?: string;
};

// Mock data for predefined behaviors
export const behaviors: BehaviorOption[] = [
  {
    id: "behavior-1",
    name: "Aggression",
    definition:
      "Physical actions directed at others that may cause harm, including hitting, kicking, biting, or pushing",
    category: "Challenging",
  },
  {
    id: "behavior-2",
    name: "Self-injury",
    definition:
      "Actions directed toward self that may cause harm, such as head banging, biting self, or hitting self",
    category: "Challenging",
  },
  {
    id: "behavior-3",
    name: "Property destruction",
    definition:
      "Behaviors that damage or destroy objects in the environment, such as throwing items, breaking objects, or tearing materials",
    category: "Challenging",
  },
  {
    id: "behavior-4",
    name: "Elopement",
    definition: "Leaving a designated area without permission or supervision",
    category: "Safety",
  },
  {
    id: "behavior-5",
    name: "Non-compliance",
    definition:
      "Refusing to follow instructions or complete requests within a reasonable time frame",
    category: "Instructional",
  },
  {
    id: "behavior-6",
    name: "Tantrum",
    definition:
      "Combination of crying, screaming, falling to the floor, and other emotional expressions that persist for a period of time",
    category: "Emotional",
  },
  {
    id: "behavior-7",
    name: "Verbal disruption",
    definition:
      "Inappropriate vocalizations including yelling, screaming, or using inappropriate language that disrupts the environment",
    category: "Disruptive",
  },
  {
    id: "behavior-8",
    name: "Stereotypy",
    definition:
      "Repetitive movements or vocalizations that serve no apparent function in the current context",
    category: "Repetitive",
  },
  {
    id: "behavior-9",
    name: "Food refusal",
    definition:
      "Consistently refusing to eat foods or entire food groups, pushing away food, or engaging in disruptive behaviors during mealtimes",
    category: "Eating",
  },
  {
    id: "behavior-10",
    name: "Attention-seeking",
    definition:
      "Behaviors that appear to be maintained by gaining attention from others, including both appropriate and inappropriate means of seeking attention",
    category: "Social",
  },
];

// Function to get all behaviors
export const getAllBehaviors = async (): Promise<BehaviorOption[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return behaviors;
};

// Function to get behavior by ID
export const getBehaviorById = async (
  id: string
): Promise<BehaviorOption | undefined> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return behaviors.find((behavior) => behavior.id === id);
};

// Function to search behaviors by name
export const searchBehaviorsByName = async (
  query: string
): Promise<BehaviorOption[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  const lowerQuery = query.toLowerCase();
  return behaviors.filter(
    (behavior) =>
      behavior.name.toLowerCase().includes(lowerQuery) ||
      behavior.definition.toLowerCase().includes(lowerQuery)
  );
};
