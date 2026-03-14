import { z } from "zod";

export const CreateProjectSchema = z.object({
    name: z.string().min(2).max(120),
    organisationId: z.cuid()
})

export type CreateProjectType = z.infer<typeof CreateProjectSchema>