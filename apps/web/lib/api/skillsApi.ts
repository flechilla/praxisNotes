import { SkillProgramOption, SkillTargetOption } from "../mocks/skillsData";

/**
 * Fetches all skill programs
 */
export const fetchSkillPrograms = async (): Promise<SkillProgramOption[]> => {
  try {
    const response = await fetch("/api/skills");

    if (!response.ok) {
      throw new Error(`Error fetching skill programs: ${response.status}`);
    }

    const data = await response.json();
    return data.programs;
  } catch (error) {
    console.error("Failed to fetch skill programs:", error);
    throw error;
  }
};

/**
 * Fetches target skills for a specific program
 */
export const fetchTargetsByProgramId = async (
  programId: string
): Promise<SkillTargetOption[]> => {
  try {
    const response = await fetch(`/api/skills?programId=${programId}`);

    if (!response.ok) {
      throw new Error(`Error fetching target skills: ${response.status}`);
    }

    const data = await response.json();
    return data.targets;
  } catch (error) {
    console.error(`Failed to fetch targets for program ${programId}:`, error);
    throw error;
  }
};
