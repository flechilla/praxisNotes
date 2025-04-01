/**
 * Represents a general option in the system
 */
export type Option = {
  id: string;
  name: string;
  value: string;
  category?: string;
  description?: string;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
};

/**
 * Response structure for option API requests
 */
export type OptionResponse = {
  option?: Option;
  options?: Option[];
  error?: string;
};

/**
 * Represents a category of options
 */
export type OptionCategory = {
  id: string;
  name: string;
  description?: string;
};
