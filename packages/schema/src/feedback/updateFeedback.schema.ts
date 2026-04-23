import { z } from "zod";
import { FeedbackStatusSchema } from "./createFeedback.schema";

export const updateFeedbackStatusSchema = z.object({
    params: z.object({
        projectId: z.string().min(1),
        feedbackId: z.string().min(1),
    }),
    body: z.object({
        status: FeedbackStatusSchema,
    }),
});

export type UpdateFeedbackStatusInput = z.infer<typeof updateFeedbackStatusSchema>["params"] & z.infer<typeof updateFeedbackStatusSchema>["body"];