import { z } from "zod";

export const AddProjectMemberSchema = z.object({
    userId: z.cuid(),
    projectId: z.cuid(),
    role: z.enum(["ADMIN", "MEMBER"])
})

export type AddProjectMember = z.infer<typeof AddProjectMemberSchema>