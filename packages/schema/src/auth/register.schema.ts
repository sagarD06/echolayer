import { z } from "zod";

export const RegisterSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be atleast 2 characters long"),
        email: z.email("Invalid email address"),
        phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
        password: z.string().min(8, "Password must be atleast 8 characters long").regex(/[A-Z]/, "Must contain atleast one uppercase letter").regex(/[a-z]/, "Must contain atleast one lowercase letter").regex(/[0-9]/, "Must contain atleast one number").regex(/[@$!%*?&]/, "Must contain atleast one special character"),
        organisationName: z.string().min(2, "Organisation name must be atleast 2 characters long")
    })
})

export const LoginSchema = z.object({
    body: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(1, "Password is required")
    })
})

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email"),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string().min(1, "Token is required"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[0-9]/, "Must contain at least one number"),
    }),
});

export type RegisterInputType = z.infer<typeof RegisterSchema>["body"]
export type LoginInputType = z.infer<typeof LoginSchema>["body"]
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];