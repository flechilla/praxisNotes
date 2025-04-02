/**
 * Represents a report in the system
 */
export type Report = {
  id: string;
  title: string;
  content: string;
  clientId?: string;
  userId: string;
  status: ReportStatus;
  type: ReportType;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
};

/**
 * Report status enum
 */
export enum ReportStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

/**
 * Report type enum
 */
export enum ReportType {
  SESSION = "session",
  PROGRESS = "progress",
  ASSESSMENT = "assessment",
  CUSTOM = "custom",
}

/**
 * Represents a section of a report
 */
export type ReportSection = {
  id: string;
  reportId: string;
  title: string;
  content: string;
  order: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Response structure for report API requests
 */
export type ReportResponse = {
  report?: Report;
  reports?: Report[];
  sections?: ReportSection[];
  error?: string;
};
