import {
  SessionFormData,
  ActivityBasedSessionFormData,
} from "../types/SessionForm";
import { Report } from "../types/Report";
import { getClientById } from "../mocks/clientData";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import {
  createNarrativeReportPrompt,
  createLegacyReportPrompt,
} from "../prompts/sessionReport";

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

  // Calculate session duration
  const sessionDuration = calculateSessionDuration(
    formData.basicInfo.startTime,
    formData.basicInfo.endTime
  );

  // Choose the appropriate prompt template based on the form data type
  let prompt: string;
  if (isActivityBased(formData)) {
    prompt = createNarrativeReportPrompt(
      formData,
      client,
      rbtName,
      sessionDuration
    );
  } else {
    prompt = createLegacyReportPrompt(
      formData,
      client,
      rbtName,
      sessionDuration
    );
  }

  try {
    console.log("Generating report with Anthropic");
    const response = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt,
    });
    console.log("Report generated with Anthropic");

    const reportContent = response.text;

    // For activity-based reports, we're not using sections anymore
    if (isActivityBased(formData)) {
      return {
        clientName: `${client.firstName} ${client.lastName}`,
        sessionDate: formData.basicInfo.sessionDate,
        sessionDuration,
        location: formData.basicInfo.location,
        rbtName,
        summary: "", // Not applicable for narrative format
        skillAcquisition: {
          title: "Skill Acquisition",
          content: "", // Not applicable for narrative format
        },
        behaviorManagement: {
          title: "Behavior Management",
          content: "", // Not applicable for narrative format
        },
        reinforcement: {
          title: "Reinforcement",
          content: "", // Not applicable for narrative format
        },
        observations: {
          title: "Observations",
          content: "", // Not applicable for narrative format
        },
        recommendations: {
          title: "Recommendations",
          content: "", // Not applicable for narrative format
        },
        nextSteps: {
          title: "Next Steps",
          content: "", // Not applicable for narrative format
        },
        fullContent: reportContent,
        createdAt: new Date().toISOString(),
        status: "draft",
      };
    } else {
      // For legacy reports, use the section parser
      const sections = parseReportSections(reportContent);

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
    }
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error(
      "Failed to generate report using AI. Please try again later."
    );
  }
};

// Function to parse the generated content into sections (for legacy reports)
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
