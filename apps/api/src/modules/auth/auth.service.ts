import bcrypt from "bcrypt";
import crypto from "crypto";

import { prisma } from "@echolayer/database";
import { getQueues, JobName } from "@echolayer/queues";
import { CacheDelete, Cachekeys } from "@echolayer/cache";
import { type RegisterInputType, type LoginInputType, type ForgotPasswordInput, type ResetPasswordInput, UserRole } from "@echolayer/schema";

import { signAccessTokeen, signRefreshToken, verifyRefreshToken, type TokenPayload } from "../../utils/jwt";
import { AppError } from "../../utils/app-error";

export async function RegisterUser(input: RegisterInputType) {
    const existingOrganisation = await prisma.organisation.findUnique({
        where: { name: input.organisationName }
    })

    if (existingOrganisation) {
        throw new AppError("Organisation name already exists", 409);
    }

    const existingemail = await prisma.user.findUnique({
        where: { email: input.email }
    })

    if (existingemail) {
        throw new AppError("Email already in use", 409);
    }

    const existingPhone = await prisma.user.findUnique({
        where: { phone: input.phone }
    })

    if (existingPhone) {
        throw new AppError("Phone number already in use", 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { user } = await prisma.$transaction(async (tx) => {

        const organisation = await tx.organisation.create({
            data: {
                name: input.organisationName
            }
        })

        const user = await tx.user.create({
            data: {
                name: input.name,
                email: input.email,
                phone: input.phone,
                password: hashedPassword,
                role: "OWNER",
                organisationId: organisation.id,
                verificationToken: verificationToken,
                verificationTokenExpiresAt: verificationTokenExpiry,
                emailVerified: false
            },
            select: { id: true, name: true, email: true }
        })

        return { organisation, user };
    });

    // Send verification email
    await getQueues(JobName.SEND_VERIFICATION_EMAIL).add(JobName.SEND_VERIFICATION_EMAIL, {
        userId: user.id,
        email: user.email,
        name: user.name,
        verificationToken: verificationToken
    })
    return { message: "Registration successful. Please check your email to verify your account." };
}

export async function verifyEmail(token: string) {
    const user = await prisma.user.findUnique({
        where: { verificationToken: token },
        select: {
            id: true,
            verificationTokenExpiresAt: true,
            emailVerified: true
        }
    })

    if (!user) {
        throw new AppError("Invalid verification token", 400);
    }
    if (user.emailVerified) {
        throw new AppError("Email already verified", 400);
    }
    if (!user.verificationTokenExpiresAt || user.verificationTokenExpiresAt < new Date()) {
        throw new AppError("Verification token expired", 400);
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: true,
            verificationToken: null,
            verificationTokenExpiresAt: null
        }
    })

    return { message: "Email verified successfully. You can now log in." };
}

export async function loginUser(input: LoginInputType) {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            emailVerified: true,
            role: true,
            organisationId: true,
            lastLoginAt: true
        }
    })

    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const validPassword = await bcrypt.compare(input.password, user.password);

    if (!validPassword) {
        throw new AppError("Invalid credentials", 401);
    }

    if (!user.emailVerified) {
        throw new AppError("Email not verified. Please check your email for verification instructions.", 403);
    }

    const isFirstLogin = user.lastLoginAt === null;

    await prisma.user.update({
        where: { id: user.id },
        data: {
            lastLoginAt: new Date()
        }
    })

    if (isFirstLogin) {
        const organnisation = await prisma.organisation.findUnique({
            where: { id: user.organisationId },
            select: { name: true }
        })

        await getQueues(JobName.SEND_WELCOME_EMAIL).add(JobName.SEND_WELCOME_EMAIL, {
            userId: user.id,
            email: user.email,
            name: user.name,
            organizationName: organnisation?.name ?? "Echolayer"
        })
    }

    const payload: TokenPayload = { userId: user.id, email: user.email };

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as UserRole,
        },
        accessToken: signAccessTokeen(payload),
        refreshToken: signRefreshToken(payload)
    }
}

export async function forgotPassword(input: ForgotPasswordInput) {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: { id: true, name: true, email: true }
    })

    if (!user) {
        throw new AppError("If an account with that email exists, a password reset link has been sent", 200);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetPasswordToken: resetToken,
            resetPasswordTokenExpiresAt: resetTokenExpiry
        }
    })

    await getQueues(JobName.SEND_PASSWORD_RESET_EMAIL).add(JobName.SEND_PASSWORD_RESET_EMAIL, {
        userId: user.id,
        email: user.email,
        name: user.name,
        resetPasswordToken: resetToken
    })

    return { message: "If an account with that email exists, a password reset link has been sent" };
}

export async function resetPassword(input: ResetPasswordInput) {
    const user = await prisma.user.findUnique({
        where: { resetPasswordToken: input.token },
        select: { id: true, name: true, email: true, resetPasswordToken: true, resetPasswordTokenExpiresAt: true }
    })

    if (!user) {
        throw new AppError("Invalid or expired reset token", 400);
    }

    if (!user.resetPasswordTokenExpiresAt || user.resetPasswordTokenExpiresAt < new Date()) {
        throw new AppError("Invalid or expired reset token", 400);
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpiresAt: null
        }
    })

    await CacheDelete(Cachekeys.user(user.id));

    return { message: "Password reset successful. You can now log in with your new password." };
}

export async function refreshTokens(token: string) {
    let payload: TokenPayload;

    try {
        payload = verifyRefreshToken(token);
    } catch (error) {
        throw new AppError("Invalid refresh token", 401);
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
            id: true,
            email: true
        }
    })

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const newPayload: TokenPayload = { userId: user.id, email: user.email };

    return {
        accessToken: signAccessTokeen(newPayload),
        refreshToken: signRefreshToken(newPayload)
    }
}