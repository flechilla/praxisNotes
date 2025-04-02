import { BehaviorOption } from "../mocks/behaviorsData";
import { BehaviorOption as SharedBehaviorOption } from "@praxisnotes/types";

/**
 * Fetches all behaviors
 */
export const fetchAllBehaviors = async (): Promise<BehaviorOption[]> => {
  try {
    const response = await fetch("/api/behaviors");

    if (!response.ok) {
      throw new Error(`Error fetching behaviors: ${response.status}`);
    }

    const { data } = await response.json();

    if (!data.behaviors || !Array.isArray(data.behaviors)) {
      throw new Error("Invalid response format from behaviors API");
    }

    return data.behaviors.map((behavior: SharedBehaviorOption) => ({
      id: behavior.id,
      name: behavior.name,
      definition: behavior.definition,
      category: behavior.category,
    }));
  } catch (error) {
    console.error("Failed to fetch behaviors:", error);
    throw error;
  }
};

/**
 * Fetches a specific behavior by ID
 */
export const fetchBehaviorById = async (
  id: string,
): Promise<BehaviorOption | null> => {
  try {
    const response = await fetch(`/api/behaviors?id=${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Error fetching behavior: ${response.status}`);
    }

    const data = await response.json();
    return data.behavior;
  } catch (error) {
    console.error(`Failed to fetch behavior with id ${id}:`, error);
    throw error;
  }
};

/**
 * Searches behaviors by name or definition
 */
export const searchBehaviors = async (
  query: string,
): Promise<BehaviorOption[]> => {
  try {
    const response = await fetch(
      `/api/behaviors?search=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error(`Error searching behaviors: ${response.status}`);
    }

    const data = await response.json();
    return data.behaviors;
  } catch (error) {
    console.error(`Failed to search behaviors with query "${query}":`, error);
    throw error;
  }
};
