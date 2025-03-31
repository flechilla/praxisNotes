import { SessionFormData } from "../types/SessionForm";
import { Report } from "../types/Report";
import { getClientById } from "../mocks/clientData";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

// Function to format the form data into a prompt for the AI
export const createReportPrompt = (
  formData: SessionFormData,
  rbtName: string
): string => {
  const client = getClientById(formData.basicInfo.clientId);
  if (!client) {
    throw new Error("Client not found");
  }

  const {
    basicInfo,
    skillAcquisition,
    behaviorTracking,
    reinforcement,
    generalNotes,
  } = formData;

  // Calculate session duration
  const startTime = new Date(`1970-01-01T${basicInfo.startTime}`);
  const endTime = new Date(`1970-01-01T${basicInfo.endTime}`);
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );
  const sessionDuration =
    `${durationHours > 0 ? `${durationHours} hour${durationHours > 1 ? "s" : ""}` : ""} ${durationMinutes} minute${durationMinutes > 1 ? "s" : ""}`.trim();

  return `
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

SKILL ACQUISITION:
${skillAcquisition.skills
  .map(
    (skill) => `
- Program: ${skill.programName}
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
- Behavior: ${behavior.behaviorName}
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
- Type: ${reinforcer.reinforcerType}
- Reinforcer: ${reinforcer.reinforcerName}
- Effectiveness: ${reinforcer.effectiveness}/5
- Notes: ${reinforcer.notes}
`
  )
  .join("\n")}

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
};

// Function to generate a report using Anthropic's Claude
export const generateReport = async (
  formData: SessionFormData,
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
    const startTime = new Date(`1970-01-01T${formData.basicInfo.startTime}`);
    const endTime = new Date(`1970-01-01T${formData.basicInfo.endTime}`);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor(
      (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    const sessionDuration =
      `${durationHours > 0 ? `${durationHours} hour${durationHours > 1 ? "s" : ""}` : ""} ${durationMinutes} minute${durationMinutes > 1 ? "s" : ""}`.trim();

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

// Helper function to parse the generated content into sections
const parseReportSections = (content: string) => {
  const sections: Record<string, string> = {
    summary: "",
    skillAcquisition: "",
    behaviorManagement: "",
    reinforcement: "",
    observations: "",
    recommendations: "",
    nextSteps: "",
  };

  // Define patterns to match each section
  const sectionPatterns = [
    {
      key: "summary",
      pattern:
        /(?:summary|session\s+summary)(?::|:?\s*?\n)([\s\S]*?)(?=\n\s*?(?:skill|behavior|reinforcement|observation|recommendation|next|$))/i,
    },
    {
      key: "skillAcquisition",
      pattern:
        /skill\s+acquisition(?::|:?\s*?\n)([\s\S]*?)(?=\n\s*?(?:behavior|reinforcement|observation|recommendation|next|$))/i,
    },
    {
      key: "behaviorManagement",
      pattern:
        /behavior\s+management(?::|:?\s*?\n)([\s\S]*?)(?=\n\s*?(?:reinforcement|observation|recommendation|next|$))/i,
    },
    {
      key: "reinforcement",
      pattern:
        /reinforcement(?::|:?\s*?\n)([\s\S]*?)(?=\n\s*?(?:observation|recommendation|next|$))/i,
    },
    {
      key: "observations",
      pattern:
        /observation(?:s)?(?::|:?\s*?\n)([\s\S]*?)(?=\n\s*?(?:recommendation|next|$))/i,
    },
    {
      key: "recommendations",
      pattern:
        /recommendation(?:s)?(?::|:?\s*?\n)([\s\S]*?)(?=\n\s*?(?:next|$))/i,
    },
    { key: "nextSteps", pattern: /next\s+steps(?::|:?\s*?\n)([\s\S]*?)(?=$)/i },
  ];

  // Extract each section
  sectionPatterns.forEach(({ key, pattern }) => {
    const match = content.match(pattern);
    if (match && match[1]) {
      sections[key] = match[1].trim();
    }
  });

  return sections;
};
