export type ReportSection = {
  title: string;
  content: string;
};

export type Report = {
  id?: string;
  clientName: string;
  sessionDate: string;
  sessionDuration: string;
  location: string;
  rbtName: string;
  summary: string;
  skillAcquisition: ReportSection;
  behaviorManagement: ReportSection;
  reinforcement: ReportSection;
  observations: ReportSection;
  recommendations: ReportSection;
  nextSteps: ReportSection;
  fullContent: string;
  createdAt?: string;
  updatedAt?: string;
  status?: "draft" | "submitted" | "reviewed";
};
