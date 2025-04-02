import { z } from "zod";

/**
 * Schema for report generation request
 */
export const reportGenerationSchema = z.object({
  formData: z.object({
    basicInfo: z.object({
      sessionDate: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      location: z.string(),
      clientId: z.string().uuid("Invalid client ID"),
    }),
    initialStatus: z.object({
      clientStatus: z.string(),
      caregiverReport: z.string(),
      initialResponse: z.string(),
      medicationChanges: z.string(),
    }),
    activities: z.object({
      activities: z.array(
        z.object({
          id: z.string().optional(),
          name: z.string(),
          description: z.string().optional(),
          goal: z.string().optional(),
          location: z.string().optional(),
          duration: z.number().optional(),
          completed: z.boolean().optional(),
          completionNotes: z.string().optional(),
          behaviors: z
            .array(
              z.object({
                intensity: z.string().optional(),
                interventionUsed: z.array(z.string()).optional(),
                interventionNotes: z.string().optional(),
              }),
            )
            .optional(),
          promptsUsed: z
            .array(
              z.object({
                type: z.string(),
                count: z.number().optional(),
              }),
            )
            .optional(),
          skills: z
            .array(
              z.object({
                id: z.string(),
                promptLevel: z.string().optional(),
                trials: z.number().optional(),
                mastery: z.number().optional(),
                correct: z.number().optional(),
                incorrect: z.number().optional(),
                prompted: z.number().optional(),
                notes: z.string().optional(),
              }),
            )
            .optional(),
          reinforcement: z
            .object({
              reinforcerId: z.string().optional(),
              effectiveness: z.string().optional(),
              notes: z.string().optional(),
            })
            .optional(),
        }),
      ),
    }),
    generalNotes: z.object({
      sessionNotes: z.string(),
      caregiverFeedback: z.string(),
      environmentalFactors: z.string(),
      nextSessionFocus: z.string(),
    }),
  }),
  rbtName: z.string().min(1, "RBT name is required"),
  isActivityBased: z.boolean().optional(),
});

/**
 * Schema for report metadata response
 */
export const reportMetadataSchema = z.object({
  clientName: z.string(),
  sessionDate: z.string(),
  sessionDuration: z.string(),
  location: z.string(),
  rbtName: z.string(),
});
