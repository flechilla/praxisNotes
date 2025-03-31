export type ReinforcerOption = {
  id: string;
  name: string;
  type: string;
  description?: string;
  category?: string;
};

// Mock data for predefined reinforcers
export const mockReinforcers: ReinforcerOption[] = [
  {
    id: "reinforcer-1",
    name: "Praise",
    type: "social",
    description: "Verbal expressions of approval for appropriate behaviors",
    category: "Social",
  },
  {
    id: "reinforcer-2",
    name: "High-five",
    type: "social",
    description: "Physical gesture of approval",
    category: "Social",
  },
  {
    id: "reinforcer-3",
    name: "Token economy",
    type: "secondary",
    description:
      "System where tokens are earned for desired behaviors and exchanged for preferred items or activities",
    category: "System",
  },
  {
    id: "reinforcer-4",
    name: "Stickers",
    type: "secondary",
    description: "Small adhesive decorations provided for completing tasks",
    category: "Tangible",
  },
  {
    id: "reinforcer-5",
    name: "Break time",
    type: "activity",
    description: "Short period away from demands or work",
    category: "Activity",
  },
  {
    id: "reinforcer-6",
    name: "Tablet time",
    type: "activity",
    description: "Time allowed on electronic device",
    category: "Activity",
  },
  {
    id: "reinforcer-7",
    name: "Edible treat",
    type: "primary",
    description: "Food items provided contingent on behavior",
    category: "Edible",
  },
  {
    id: "reinforcer-8",
    name: "Favorite game",
    type: "activity",
    description: "Opportunity to play a preferred game",
    category: "Activity",
  },
  {
    id: "reinforcer-9",
    name: "Choice making",
    type: "activity",
    description: "Opportunity to make choices about activities or materials",
    category: "Control",
  },
  {
    id: "reinforcer-10",
    name: "Time with preferred toy",
    type: "activity",
    description: "Access to a favorite toy or item",
    category: "Tangible",
  },
];
