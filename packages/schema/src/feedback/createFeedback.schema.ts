import { z } from "zod";

export const FeedbackTypeSchema = z.enum([
    "IDEA",
    "SUGGESTION",
    "PROBLEM",
    "QUESTION",
    "PRAISE"
])

export const FeedbackStatusSchema = z.enum([
    "OPEN",
    "PLANNED",
    "IN_PROGRESS",
    "COMPLETED"
])

export const CreateFeedbackSchema = z.object({
    body: z.object({
        title: z.string().min(2).max(120),
        content: z.string().min(2).max(1000),
        type: FeedbackTypeSchema,
        projectId: z.string().min(1),
    })
})

export type CreateFeedbackInput = z.infer<typeof CreateFeedbackSchema>
export type FeedbackStatus = z.infer<typeof FeedbackStatusSchema>
export type FeedbackType = z.infer<typeof FeedbackTypeSchema>