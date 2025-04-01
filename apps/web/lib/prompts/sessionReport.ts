import {
  SessionFormData,
  ActivityBasedSessionFormData,
  Activity,
  ActivityBehavior,
  ActivityPrompt,
} from "@praxisnotes/types/src/SessionForm";
import { ClientInfo } from "@praxisnotes/types/src/SessionForm";

// Function to generate the client information section of the prompt
const generateClientInfoSection = (client: ClientInfo, rbtName: string) => {
  return `
CLIENT INFORMATION:
- Name: ${client.firstName} ${client.lastName}
- Date of Birth: ${client.dob}
- Diagnosis: ${client.diagnosis}
- Guardian: ${client.guardian}
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
  initialStatus: ActivityBasedSessionFormData["initialStatus"],
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

// Function to generate an activity description
const generateActivityDescription = (activity: Activity, index: number) => {
  return `
Activity ${index + 1}: ${activity.name}
- Description: ${activity.description}
- Goal: ${activity.goal}
- Location: ${activity.location}
${activity.duration ? `- Duration: ${activity.duration} minutes` : ""}

${
  activity.behaviors.length > 0
    ? `Behaviors During Activity:
${activity.behaviors.map(generateBehaviorDescription).join("")}`
    : ""
}

${
  activity.promptsUsed.length > 0
    ? `Prompts Used:
${activity.promptsUsed.map(generatePromptDescription).join("")}`
    : ""
}

Completion:
- Status: ${activity.completed ? "Completed" : "Not completed"}
${activity.completionNotes ? `- Notes: ${activity.completionNotes}` : ""}

Reinforcement:
- Reinforcer: ${activity.reinforcement.reinforcerName}
- Type: ${activity.reinforcement.type}
${activity.reinforcement.notes ? `- Notes: ${activity.reinforcement.notes}` : ""}
`;
};

// Function to generate the activities section of the prompt
const generateActivitiesSection = (
  activities: ActivityBasedSessionFormData["activities"],
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

// Function to generate the skill acquisition section (for backward compatibility)
const generateSkillAcquisitionSection = (
  skillAcquisition: SessionFormData["skillAcquisition"],
) => {
  return `
SKILL ACQUISITION:
${skillAcquisition.skills
  .map(
    (skill) => `
- Program: ${skill.programName || skill.program}
- Trials: ${skill.trials} (${skill.correct} correct, ${skill.prompted} prompted, ${skill.incorrect} incorrect)
- Prompt Level: ${skill.promptLevel}
- Notes: ${skill.notes}
`,
  )
  .join("\n")}
`;
};

// Function to generate the behavior tracking section (for backward compatibility)
const generateBehaviorTrackingSection = (
  behaviorTracking: SessionFormData["behaviorTracking"],
) => {
  return `
BEHAVIOR TRACKING:
${behaviorTracking.behaviors
  .map(
    (behavior) => `
- Behavior: ${behavior.behaviorName || behavior.name}
- Frequency: ${behavior.frequency} times
${behavior.duration ? `- Duration: ${behavior.duration} minutes` : ""}
${behavior.intensity ? `- Intensity: ${behavior.intensity}` : ""}
- Antecedent: ${behavior.antecedent}
- Consequence: ${behavior.consequence}
- Intervention: ${behavior.intervention}
`,
  )
  .join("\n")}
`;
};

// Function to generate the reinforcement section (for backward compatibility)
const generateReinforcementSection = (
  reinforcement: SessionFormData["reinforcement"],
) => {
  return `
REINFORCEMENT:
${reinforcement.reinforcers
  .map(
    (reinforcer) => `
- Type: ${reinforcer.reinforcerType || reinforcer.type}
- Reinforcer: ${reinforcer.reinforcerName || reinforcer.name}
- Effectiveness: ${reinforcer.effectiveness}/5
- Notes: ${reinforcer.notes}
`,
  )
  .join("\n")}
`;
};

// Main prompt template for the new narrative format
export const createNarrativeReportPrompt = (
  formData: ActivityBasedSessionFormData,
  client: ClientInfo,
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

Use language like in this example:
"BM's therapy session took place at his home, where his mother (VB) and the RBT (KX) were present. VB reported that BM had allergies; however, no changes in BM's medication were reported. When the RBT arrived at the home, BM was sitting on the sofa with his tablet. Upon seeing the RBT, he responded to her greeting after approximately five seconds."

Please provide ONLY the narrative report without any section headings, metadata, or additional commentary.
`;

  return prompt;
};

// Legacy prompt template (for backward compatibility)
export const createLegacyReportPrompt = (
  formData: SessionFormData,
  client: ClientInfo,
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

  // Add skill acquisition section
  prompt += generateSkillAcquisitionSection(formData.skillAcquisition);

  // Add behavior tracking section
  prompt += generateBehaviorTrackingSection(formData.behaviorTracking);

  // Add reinforcement section
  prompt += generateReinforcementSection(formData.reinforcement);

  // Add general notes
  prompt += generateGeneralNotesSection(formData.generalNotes);

  // Add instructions for the legacy format (still narrative but with markdown structure)
  prompt += `
Please generate a professional report in raw markdown format with the following sections:
1. Summary
2. Skill Acquisition
3. Behavior Management
4. Reinforcement
5. Observations
6. Recommendations
7. Next Steps

The report should be written in a professional, clinical tone that would be appropriate for both parents and other healthcare professionals. Include specific data from the session but present it in a narrative format rather than just listing information. Incorporate professional terminology where appropriate.
`;

  return prompt;
};
