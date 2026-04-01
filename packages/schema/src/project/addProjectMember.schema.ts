import z from "zod";

export const sendInviteSchema = z.object({
    params: z.object({ projectId: z.string().min(1) }),
    body: z.object({
        email: z.email(),
        role: z.enum(["ADMIN", "MEMBER"]),
    }),
});

export const acceptInviteSchema = z.object({
    body: z.object({
        token: z.string().min(1),
        name: z.string().min(2),
        phone: z.string().regex(/^\+?[1-9]\d{9,14}$/),
        password: z.string().min(8)
            .regex(/[A-Z]/, "Must contain uppercase")
            .regex(/[0-9]/, "Must contain number"),
    }),
});

export const addProjectMemberSchema = z.object({
    params: z.object({ projectId: z.string().min(1) }),
    body: z.object({
        email: z.email(),
        role: z.enum(["ADMIN", "MEMBER"]),
    }),
});

export const updateProjectMemberRoleSchema = z.object({
    params: z.object({
        projectId: z.string().min(1),
        userId: z.string().min(1),
    }),
    body: z.object({
        role: z.enum(["ADMIN", "MEMBER"]),
    }),
});

export type SendInviteInput = z.infer<typeof sendInviteSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
export type UpdateProjectMemberRoleInput = z.infer<typeof updateProjectMemberRoleSchema>;