/**
 * Represents report generation data
 */
export type GenerateData = {
  id: string;
  userId: string;
  clientId?: string;
  formData: Record<string, unknown>;
  reportType: string;
  status: GenerateStatus;
  result?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
};

/**
 * Generation status enum
 */
export enum GenerateStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

/**
 * Input for generating a report
 */
export type GenerateInput = {
  clientId?: string;
  reportType: string;
  formData: Record<string, unknown>;
};

/**
 * Response structure for generate API requests
 */
export type GenerateResponse = {
  generateData?: GenerateData;
  history?: GenerateData[];
  error?: string;
};
