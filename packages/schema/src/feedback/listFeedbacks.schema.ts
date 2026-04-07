import z from "zod";

export const listFeedbacksSchema = z.object({
  params: z.object({
    projectId: z.string().min(1),
  }),
  query: z.object({
    limit: z.coerce.number().min(1).max(100).default(20),
    cursor: z.string().optional(),
  }),
});

export type ListFeedbacksInput = z.infer<typeof listFeedbacksSchema>;