import {
  SessionFormData,
  ActivityBehavior,
  ActivityPrompt,
  ActivityWithRelations,
  ActivityReinforcement,
} from "@praxisnotes/types";
import { Client } from "@praxisnotes/types";

// Function to generate the client information section of the prompt
const generateClientInfoSection = (client: Client, rbtName: string) => {
  return `
CLIENT INFORMATION:
- Name: ${client.firstName} ${client.lastName}
- RBT: ${rbtName}
`;
};

// Function to generate the session information section of the prompt
const generateSessionInfoSection = (
  basicInfo: SessionFormData["basicInfo"],
  sessionDuration: string,
) => {
  return `
SESSION INFORMATION:
- Date: ${basicInfo.sessionDate}
- Time: ${basicInfo.startTime} to ${basicInfo.endTime} (${sessionDuration})
- Location: ${basicInfo.location}
`;
};

// Function to generate the initial status section of the prompt
const generateInitialStatusSection = (
  initialStatus: SessionFormData["initialStatus"],
) => {
  return `
CLIENT INITIAL STATUS:
- Status on arrival: ${initialStatus.clientStatus}
${initialStatus.caregiverReport ? `- Caregiver report: ${initialStatus.caregiverReport}` : ""}
- Initial response: ${initialStatus.initialResponse}
${initialStatus.medicationChanges ? `- Medication changes: ${initialStatus.medicationChanges}` : ""}
`;
};

// Function to generate a behavior description
const generateBehaviorDescription = (behavior: ActivityBehavior) => {
  return `
- Behavior: ${behavior.behaviorName}
- Intensity: ${behavior.intensity}
- Interventions: ${behavior.interventionUsed.join(", ")}
${behavior.interventionNotes ? `- Notes: ${behavior.interventionNotes}` : ""}
`;
};

// Function to generate a prompt description
const generatePromptDescription = (prompt: ActivityPrompt) => {
  return `
- ${prompt.type}: ${prompt.count} times
`;
};

// Function to extract reinforcement information
const extractReinforcementInfo = (
  reinforcement: ActivityReinforcement[] | undefined,
): {
  reinforcerName: string;
  reinforcerType: string;
  reinforcerNotes: string;
} => {
  // Default values
  const defaultInfo = {
    reinforcerName: "None",
    reinforcerType: "None",
    reinforcerNotes: "",
  };

  // Check if reinforcement array exists and has items
  if (!Array.isArray(reinforcement) || reinforcement.length === 0) {
    return defaultInfo;
  }

  const firstReinforcement = reinforcement[0];

  // Return default values if firstReinforcement is undefined
  if (!firstReinforcement) {
    return defaultInfo;
  }

  // Only access properties if reinforcement is defined
  return {
    reinforcerName:
      firstReinforcement.reinforcementName || defaultInfo.reinforcerName,
    reinforcerType:
      firstReinforcement.reinforcementType || defaultInfo.reinforcerType,
    reinforcerNotes: firstReinforcement.notes || defaultInfo.reinforcerNotes,
  };
};

// Function to generate behaviors section
const generateBehaviorsSection = (behaviors: ActivityBehavior[]): string => {
  if (behaviors.length === 0) return "";

  return `Behaviors During Activity:
${behaviors.map(generateBehaviorDescription).join("")}`;
};

// Function to generate prompts section
const generatePromptsSection = (prompts: ActivityPrompt[]): string => {
  if (prompts.length === 0) return "";

  return `Prompts Used:
${prompts.map(generatePromptDescription).join("")}`;
};

// Function to generate activity description
const generateActivityDescription = (
  activity: ActivityWithRelations,
  index: number,
) => {
  const { reinforcerName, reinforcerType, reinforcerNotes } =
    extractReinforcementInfo(activity.reinforcement);

  const behaviorsSection = generateBehaviorsSection(activity.behaviors);
  const promptsSection = generatePromptsSection(activity.promptsUsed);

  return `
Activity ${index + 1}: ${activity.name}
- Description: ${activity.description}
- Goal: ${activity.goal}
- Location: ${activity.location}
${activity.duration ? `- Duration: ${activity.duration} minutes` : ""}

${behaviorsSection ? `${behaviorsSection}\n` : ""}
${promptsSection ? `${promptsSection}\n` : ""}

Completion:
- Status: ${activity.completed ? "Completed" : "Not completed"}
${activity.completionNotes ? `- Notes: ${activity.completionNotes}` : ""}

Reinforcement:
- Reinforcer: ${reinforcerName}
- Type: ${reinforcerType}
${reinforcerNotes ? `- Notes: ${reinforcerNotes}` : ""}
`;
};

// Function to generate the activities section of the prompt
const generateActivitiesSection = (
  activities: SessionFormData["activities"],
) => {
  return `
ACTIVITIES:
${activities.activities.map((activity, index) => generateActivityDescription(activity, index)).join("\n")}
`;
};

// Function to generate the general notes section of the prompt
const generateGeneralNotesSection = (
  generalNotes: SessionFormData["generalNotes"],
) => {
  return `
GENERAL NOTES:
- Session Notes: ${generalNotes.sessionNotes}
- Caregiver Feedback: ${generalNotes.caregiverFeedback}
- Environmental Factors: ${generalNotes.environmentalFactors}
- Next Session Focus: ${generalNotes.nextSessionFocus}
`;
};

// Main prompt template for the new narrative format
export const createNarrativeReportPrompt = (
  formData: SessionFormData,
  client: Client,
  rbtName: string,
  sessionDuration: string,
): string => {
  let prompt = `
You are a professional Registered Behavior Technician (RBT) writing a session report for a client. 
Please generate a comprehensive and professional report based on the following session data:
`;

  // Add client information
  prompt += generateClientInfoSection(client, rbtName);

  // Add session information
  prompt += generateSessionInfoSection(formData.basicInfo, sessionDuration);

  // Add initial status
  prompt += generateInitialStatusSection(formData.initialStatus);

  // Add activities section (the main focus)
  prompt += generateActivitiesSection(formData.activities);

  // Add general notes
  prompt += generateGeneralNotesSection(formData.generalNotes);

  // Add instructions for the narrative format
  prompt += `
Please generate a professional narrative report that flows like a cohesive story. 
DO NOT format the response as structured markdown with sections and headings.

The report should:
1. Be written in a professional but narrative tone that reads like a continuous story
2. Focus primarily on the activities and client behaviors
3. Include all relevant clinical details but presented within a flowing narrative
4. Mention the client by their initials, the guardian by their initials, and the RBT by their initials
5. Include specific data about behaviors, prompts, and reinforcements within the narrative
6. Maintain chronological flow between activities
7. End with a brief summary of environmental factors and plans for the next session

Please provide ONLY the narrative report without any section headings, metadata, or additional commentary.
`;

  return prompt;
};
