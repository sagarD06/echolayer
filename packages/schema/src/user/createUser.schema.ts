import { z } from "zod";

export const UserRoleSchema = z.enum([
    "OWNER",
    "ADMIN",
    "MEMBER"
])

export const CreateUserSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.email(),
    phone: z.string(),
    password: z.string(),
    organisationId: z.cuid(),
    role: UserRoleSchema
})

export type CreateUserInputType = z.infer<typeof CreateUserSchema>
export type UserRole = z.infer<typeof UserRoleSchema>