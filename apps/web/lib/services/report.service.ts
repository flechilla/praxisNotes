import { db, withDb } from "../db";
import { reports, reportSections } from "@praxisnotes/database";
import { insertReportSchema } from "@praxisnotes/database";
import { Report, ReportSection } from "@praxisnotes/types/src/Report";
import { eq } from "drizzle-orm";

/**
 * Service for handling reports in the database
 */
export const ReportService = {
  /**
   * Creates a new report
   */
  async createReport(
    sessionId: string,
    userId: string,
    clientId: string,
    reportData: Report,
  ) {
    return withDb(async () => {
      // Prepare report data for database
      const dbReportData = {
        sessionId,
        userId,
        clientId,
        summary: reportData.summary || null,
        fullContent: reportData.fullContent,
        status: "draft",
      };

      // Validate report data
      insertReportSchema.parse(dbReportData);

      // Insert report
      const [newReport] = await db
        .insert(reports)
        .values(dbReportData)
        .returning();

      // Prepare sections for database
      const sections = [
        reportData.skillAcquisition,
        reportData.behaviorManagement,
        reportData.reinforcement,
        reportData.observations,
        reportData.recommendations,
        reportData.nextSteps,
      ];

      // Insert sections
      await Promise.all(
        sections.map((section, index) => {
          return db.insert(reportSections).values({
            reportId: newReport.id,
            title: section.title,
            content: section.content,
            order: index,
          });
        }),
      );

      return newReport;
    });
  },

  /**
   * Gets a report by ID with all sections
   */
  async getReportById(id: string) {
    return withDb(async () => {
      const report = await db.query.reports.findFirst({
        where: eq(reports.id, id),
        with: {
          sections: {
            orderBy: (sections, { asc }) => [asc(sections.order)],
          },
          session: true,
          client: true,
          user: true,
        },
      });

      if (!report) {
        return null;
      }

      // Transform database report to application Report type
      const transformedReport: Report = {
        id: report.id,
        clientName: `${report.client.firstName} ${report.client.lastName}`,
        sessionDate: report.session.sessionDate.toISOString().split("T")[0],
        // This is simplified as real duration calculation needs start/end time
        sessionDuration: "N/A",
        location: report.session.location,
        rbtName: `${report.user.firstName} ${report.user.lastName}`,
        summary: report.summary || "",
        fullContent: report.fullContent,
        createdAt: report.createdAt.toISOString(),
        updatedAt: report.updatedAt.toISOString(),
        status: report.status,

        // Initialize sections with defaults
        skillAcquisition: { title: "Skill Acquisition", content: "" },
        behaviorManagement: { title: "Behavior Management", content: "" },
        reinforcement: { title: "Reinforcement", content: "" },
        observations: { title: "Observations", content: "" },
        recommendations: { title: "Recommendations", content: "" },
        nextSteps: { title: "Next Steps", content: "" },
      };

      // Map sections based on their order
      if (report.sections && report.sections.length > 0) {
        // Standard section mapping (assuming consistent ordering)
        const sectionNames = [
          "skillAcquisition",
          "behaviorManagement",
          "reinforcement",
          "observations",
          "recommendations",
          "nextSteps",
        ];

        report.sections.forEach((section, index) => {
          if (index < sectionNames.length) {
            transformedReport[
              sectionNames[index] as keyof typeof transformedReport
            ] = {
              title: section.title,
              content: section.content,
            } as ReportSection;
          }
        });
      }

      return transformedReport;
    });
  },

  /**
   * Updates the status of a report
   */
  async updateReportStatus(
    id: string,
    status: "draft" | "submitted" | "reviewed",
  ) {
    return withDb(async () => {
      const [updatedReport] = await db
        .update(reports)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(reports.id, id))
        .returning();

      return updatedReport;
    });
  },
};
