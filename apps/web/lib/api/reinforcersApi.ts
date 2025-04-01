import { ReinforcerOption } from "../mocks/reinforcersData";

/**
 * Fetches all available reinforcers
 * @returns Promise that resolves to an array of reinforcer objects
 */
export const fetchAllReinforcers = async (): Promise<ReinforcerOption[]> => {
  try {
    const response = await fetch("/api/reinforcements");

    if (!response.ok) {
      throw new Error(`Error fetching reinforcers: ${response.status}`);
    }

    const { data } = await response.json();

    if (!data.reinforcements || !Array.isArray(data.reinforcements)) {
      throw new Error("Invalid response format from reinforcements API");
    }

    return data.reinforcements.map((reinforcer: any) => ({
      id: reinforcer.id,
      name: reinforcer.name,
      type: reinforcer.type,
      description: reinforcer.description,
      category:
        reinforcer.type.charAt(0).toUpperCase() + reinforcer.type.slice(1),
    }));
  } catch (error) {
    console.error("Failed to fetch reinforcers:", error);
    throw error;
  }
};

/**
 * Fetches a reinforcer by ID
 * @param id The ID of the reinforcer to fetch
 * @returns Promise that resolves to a reinforcer object or null if not found
 */
export const fetchReinforcerById = async (
  id: string,
): Promise<ReinforcerOption | null> => {
  try {
    const response = await fetch(`/api/reinforcements?id=${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching reinforcer: ${response.status}`);
    }

    const { data } = await response.json();

    if (!data.reinforcement) {
      return null;
    }

    return {
      id: data.reinforcement.id,
      name: data.reinforcement.name,
      type: data.reinforcement.type,
      description: data.reinforcement.description,
      category:
        data.reinforcement.type.charAt(0).toUpperCase() +
        data.reinforcement.type.slice(1),
    };
  } catch (error) {
    console.error("Failed to fetch reinforcer:", error);
    throw error;
  }
};
