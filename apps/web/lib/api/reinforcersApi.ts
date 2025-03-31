// Mock data for reinforcers (in a real app, this would come from an API)
import { mockReinforcers, ReinforcerOption } from "../mocks/reinforcersData";

/**
 * Fetches all available reinforcers
 * @returns Promise that resolves to an array of reinforcer objects
 */
export const fetchAllReinforcers = async (): Promise<ReinforcerOption[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockReinforcers;
};

/**
 * Fetches a reinforcer by ID
 * @param id The ID of the reinforcer to fetch
 * @returns Promise that resolves to a reinforcer object or null if not found
 */
export const fetchReinforcerById = async (
  id: string
): Promise<ReinforcerOption | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return (
    mockReinforcers.find(
      (reinforcer: ReinforcerOption) => reinforcer.id === id
    ) || null
  );
};
