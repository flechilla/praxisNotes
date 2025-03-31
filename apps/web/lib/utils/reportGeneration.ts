import {
  SessionFormData,
  ActivityBasedSessionFormData,
} from "../types/SessionForm";
import { Report } from "../types/Report";
import { getClientById } from "../mocks/clientData";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

// Function to calculate session duration from start/end times
const calculateSessionDuration = (
  startTime: string,
  endTime: string
): string => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const durationMs = end.getTime() - start.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );
  return `${durationHours > 0 ? `${durationHours} hour${durationHours > 1 ? "s" : ""}` : ""} ${durationMinutes} minute${durationMinutes > 1 ? "s" : ""}`.trim();
};

// Check if form data is activity-based
const isActivityBased = (
  formData: SessionFormData | ActivityBasedSessionFormData
): formData is ActivityBasedSessionFormData => {
  return "activities" in formData && "initialStatus" in formData;
};

// Function to format the form data into a prompt for the AI
export const createReportPrompt = (
  formData: SessionFormData | ActivityBasedSessionFormData,
  rbtName: string
): string => {
  const client = getClientById(formData.basicInfo.clientId);
  if (!client) {
    throw new Error("Client not found");
  }

  const { basicInfo, generalNotes } = formData;

  // Calculate session duration
  const sessionDuration = calculateSessionDuration(
    basicInfo.startTime,
    basicInfo.endTime
  );

  // Common header for both formats
  let prompt = `
You are a professional Registered Behavior Technician (RBT) writing a session report for a client. Please generate a comprehensive and professional report based on the following session data:

CLIENT INFORMATION:
- Name: ${client.firstName} ${client.lastName}
- Date of Birth: ${client.dob}
- Diagnosis: ${client.diagnosis}
- Guardian: ${client.guardian}

SESSION INFORMATION:
- Date: ${basicInfo.sessionDate}
- Time: ${basicInfo.startTime} to ${basicInfo.endTime} (${sessionDuration})
- Location: ${basicInfo.location}
- RBT: ${rbtName}
`;

  // Check which format of form data we have
  if (isActivityBased(formData)) {
    // Activity-based format
    const { initialStatus, activities } = formData;

    prompt += `
CLIENT INITIAL STATUS:
- Status on arrival: ${initialStatus.clientStatus}
${initialStatus.caregiverReport ? `- Caregiver report: ${initialStatus.caregiverReport}` : ""}
- Initial response: ${initialStatus.initialResponse}
${initialStatus.medicationChanges ? `- Medication changes: ${initialStatus.medicationChanges}` : ""}

ACTIVITIES:
${activities.activities
  .map(
    (activity, index) => `
Activity ${index + 1}: ${activity.name}
- Description: ${activity.description}
- Goal: ${activity.goal}
- Location: ${activity.location}
${activity.duration ? `- Duration: ${activity.duration} minutes` : ""}

${
  activity.behaviors.length > 0
    ? `Behaviors During Activity:
${activity.behaviors
  .map(
    (behavior) => `
- Behavior: ${behavior.behaviorName}
- Intensity: ${behavior.intensity}
- Interventions: ${behavior.interventionUsed.join(", ")}
${behavior.interventionNotes ? `- Notes: ${behavior.interventionNotes}` : ""}
`
  )
  .join("")}`
    : ""
}

${
  activity.promptsUsed.length > 0
    ? `Prompts Used:
${activity.promptsUsed
  .map(
    (prompt) => `
- ${prompt.type}: ${prompt.count} times
`
  )
  .join("")}`
    : ""
}

Completion:
- Status: ${activity.completed ? "Completed" : "Not completed"}
${activity.completionNotes ? `- Notes: ${activity.completionNotes}` : ""}

Reinforcement:
- Reinforcer: ${activity.reinforcement.reinforcerName}
- Type: ${activity.reinforcement.type}
${activity.reinforcement.notes ? `- Notes: ${activity.reinforcement.notes}` : ""}
`
  )
  .join("\n")}
`;
  } else {
    // Original format
    const { skillAcquisition, behaviorTracking, reinforcement } = formData;

    prompt += `
SKILL ACQUISITION:
${skillAcquisition.skills
  .map(
    (skill) => `
- Program: ${skill.programName || skill.program}
- Trials: ${skill.trials} (${skill.correct} correct, ${skill.prompted} prompted, ${skill.incorrect} incorrect)
- Prompt Level: ${skill.promptLevel}
- Notes: ${skill.notes}
`
  )
  .join("\n")}

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
`
  )
  .join("\n")}

REINFORCEMENT:
${reinforcement.reinforcers
  .map(
    (reinforcer) => `
- Type: ${reinforcer.reinforcerType || reinforcer.type}
- Reinforcer: ${reinforcer.reinforcerName || reinforcer.name}
- Effectiveness: ${reinforcer.effectiveness}/5
- Notes: ${reinforcer.notes}
`
  )
  .join("\n")}
`;
  }

  // Common footer for both formats
  prompt += `
GENERAL NOTES:
- Session Notes: ${generalNotes.sessionNotes}
- Caregiver Feedback: ${generalNotes.caregiverFeedback}
- Environmental Factors: ${generalNotes.environmentalFactors}
- Next Session Focus: ${generalNotes.nextSessionFocus}

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

// Function to parse the generated content into sections
export const parseReportSections = (content: string) => {
  const sections: Record<string, string> = {};

  // Extract summary
  const summaryMatch = content.match(
    /^#\s*Summary\s*\n([\s\S]*?)(?=\n#\s|\n$)/
  );
  if (summaryMatch && summaryMatch[1]) {
    sections.summary = summaryMatch[1].trim();
  }

  // Extract skill acquisition
  const skillAcquisitionMatch = content.match(
    /^#\s*Skill\s*Acquisition\s*\n([\s\S]*?)(?=\n#\s|\n$)/m
  );
  if (skillAcquisitionMatch && skillAcquisitionMatch[1]) {
    sections.skillAcquisition = skillAcquisitionMatch[1].trim();
  }

  // Extract behavior management
  const behaviorManagementMatch = content.match(
    /^#\s*Behavior\s*Management\s*\n([\s\S]*?)(?=\n#\s|\n$)/m
  );
  if (behaviorManagementMatch && behaviorManagementMatch[1]) {
    sections.behaviorManagement = behaviorManagementMatch[1].trim();
  }

  // Extract reinforcement
  const reinforcementMatch = content.match(
    /^#\s*Reinforcement\s*\n([\s\S]*?)(?=\n#\s|\n$)/m
  );
  if (reinforcementMatch && reinforcementMatch[1]) {
    sections.reinforcement = reinforcementMatch[1].trim();
  }

  // Extract observations
  const observationsMatch = content.match(
    /^#\s*Observations\s*\n([\s\S]*?)(?=\n#\s|\n$)/m
  );
  if (observationsMatch && observationsMatch[1]) {
    sections.observations = observationsMatch[1].trim();
  }

  // Extract recommendations
  const recommendationsMatch = content.match(
    /^#\s*Recommendations\s*\n([\s\S]*?)(?=\n#\s|\n$)/m
  );
  if (recommendationsMatch && recommendationsMatch[1]) {
    sections.recommendations = recommendationsMatch[1].trim();
  }

  // Extract next steps
  const nextStepsMatch = content.match(
    /^#\s*Next\s*Steps\s*\n([\s\S]*?)(?=\n#\s|\n$)/m
  );
  if (nextStepsMatch && nextStepsMatch[1]) {
    sections.nextSteps = nextStepsMatch[1].trim();
  }

  return sections;
};

// Function to generate a report using Anthropic's Claude
export const generateReport = async (
  formData: SessionFormData | ActivityBasedSessionFormData,
  rbtName: string
): Promise<Report> => {
  console.log("Generating report");
  const client = getClientById(formData.basicInfo.clientId);
  if (!client) {
    throw new Error("Client not found");
  }
  console.log(`Generating report for ${client.firstName} ${client.lastName}`);
  console.log("formData", formData);
  const prompt = createReportPrompt(formData, rbtName);

  try {
    console.log("Generating report with Anthropic");
    const response = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt,
    });
    console.log("Report generated with Anthropic");
    console.log("response", response.text);
    // Extract the text content from the response
    const reportContent = response.text;

    // Parse the generated content into sections
    const sections = parseReportSections(reportContent);

    // Calculate session duration
    const sessionDuration = calculateSessionDuration(
      formData.basicInfo.startTime,
      formData.basicInfo.endTime
    );

    return {
      clientName: `${client.firstName} ${client.lastName}`,
      sessionDate: formData.basicInfo.sessionDate,
      sessionDuration,
      location: formData.basicInfo.location,
      rbtName,
      summary: sections.summary || "No summary provided.",
      skillAcquisition: {
        title: "Skill Acquisition",
        content:
          sections.skillAcquisition || "No skill acquisition data provided.",
      },
      behaviorManagement: {
        title: "Behavior Management",
        content:
          sections.behaviorManagement ||
          "No behavior management data provided.",
      },
      reinforcement: {
        title: "Reinforcement",
        content: sections.reinforcement || "No reinforcement data provided.",
      },
      observations: {
        title: "Observations",
        content: sections.observations || "No observations provided.",
      },
      recommendations: {
        title: "Recommendations",
        content: sections.recommendations || "No recommendations provided.",
      },
      nextSteps: {
        title: "Next Steps",
        content: sections.nextSteps || "No next steps provided.",
      },
      fullContent: reportContent,
      createdAt: new Date().toISOString(),
      status: "draft",
    };
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error(
      "Failed to generate report using AI. Please try again later."
    );
  }
};
