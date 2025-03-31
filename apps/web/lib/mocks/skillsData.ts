export type SkillProgramOption = {
  id: string;
  name: string;
  description?: string;
};

export type SkillTargetOption = {
  id: string;
  programId: string;
  name: string;
  description?: string;
};

// Mock data for skill programs
export const skillPrograms: SkillProgramOption[] = [
  {
    id: "prog-1",
    name: "Communication",
    description:
      "Focuses on developing verbal and non-verbal communication skills",
  },
  {
    id: "prog-2",
    name: "Social Skills",
    description:
      "Aims to improve social interactions and relationship building",
  },
  {
    id: "prog-3",
    name: "Self-Help",
    description: "Teaches daily living and self-care skills for independence",
  },
  {
    id: "prog-4",
    name: "Academic Skills",
    description: "Focuses on educational and learning objectives",
  },
  {
    id: "prog-5",
    name: "Play Skills",
    description: "Develops appropriate play behaviors and engagement",
  },
];

// Mock data for target skills
export const skillTargets: SkillTargetOption[] = [
  // Communication targets
  {
    id: "target-1",
    programId: "prog-1",
    name: "Requesting items",
    description: "Using words/gestures to request desired items",
  },
  {
    id: "target-2",
    programId: "prog-1",
    name: "Responding to questions",
    description: "Appropriate responses to questions like 'what's your name?'",
  },
  {
    id: "target-3",
    programId: "prog-1",
    name: "Following instructions",
    description: "Completing 1-2 step verbal instructions",
  },

  // Social Skills targets
  {
    id: "target-4",
    programId: "prog-2",
    name: "Turn taking",
    description: "Waiting for turn during activities and conversations",
  },
  {
    id: "target-5",
    programId: "prog-2",
    name: "Greeting others",
    description:
      "Appropriately greeting familiar people and responding to greetings",
  },
  {
    id: "target-6",
    programId: "prog-2",
    name: "Sharing",
    description: "Sharing toys and materials with peers",
  },

  // Self-Help targets
  {
    id: "target-7",
    programId: "prog-3",
    name: "Hand washing",
    description: "Proper hand washing technique and sequence",
  },
  {
    id: "target-8",
    programId: "prog-3",
    name: "Getting dressed",
    description: "Putting on and removing clothing items independently",
  },
  {
    id: "target-9",
    programId: "prog-3",
    name: "Toileting",
    description: "Independent toileting routine and hygiene",
  },

  // Academic Skills targets
  {
    id: "target-10",
    programId: "prog-4",
    name: "Identifying letters",
    description: "Recognizing and naming alphabet letters",
  },
  {
    id: "target-11",
    programId: "prog-4",
    name: "Counting objects",
    description: "One-to-one correspondence counting of objects",
  },
  {
    id: "target-12",
    programId: "prog-4",
    name: "Writing name",
    description: "Writing first name independently",
  },

  // Play Skills targets
  {
    id: "target-13",
    programId: "prog-5",
    name: "Cooperative play",
    description: "Engaging in interactive play with peers",
  },
  {
    id: "target-14",
    programId: "prog-5",
    name: "Pretend play",
    description: "Using imagination during play activities",
  },
  {
    id: "target-15",
    programId: "prog-5",
    name: "Following game rules",
    description: "Understanding and following basic game rules",
  },
];

// Function to get all skill programs
export const getSkillPrograms = async (): Promise<SkillProgramOption[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return skillPrograms;
};

// Function to get targets by program ID
export const getTargetsByProgramId = async (
  programId: string
): Promise<SkillTargetOption[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return skillTargets.filter((target) => target.programId === programId);
};

// Function to get all targets
export const getAllTargets = async (): Promise<SkillTargetOption[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return skillTargets;
};
