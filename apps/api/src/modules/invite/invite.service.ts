import crypto from "crypto";
import bcrypt from "bcrypt";

import { prisma, ProjectRole } from "@echolayer/database";
import { getQueues, JobName } from "@echolayer/queues";
import { CacheDelete, Cachekeys, CacheSet, CacheGet, TTL } from "@echolayer/cache";

import { AppError } from "../../utils/app-error";

export async function sendInvite(projectId: string, organisationId: string, email: string, requestingUserId: string, role: ProjectRole) {
    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId },
        select: { id: true, name: true }
    })

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: email },
        select: { id: true, organisationId: true }
    })

    if (existingUser && existingUser.organisationId === organisationId) {
        throw new AppError("User already exists in the organisation, please use add member button instead to add the user to the project", 409);
    }

    const existingInvite = await prisma.invite.findFirst({
        where: {
            email: email,
            projectId: projectId,
            expiresAt: {
                gt: new Date(),
            }
        }
    })

    if (existingInvite) {
        throw new AppError("An invite has already been sent to this email for this project and it is in pending state", 409);
    }

    const inviter = await prisma.user.findUnique({
        where: { id: requestingUserId },
        select: { id: true, name: true }
    })

    const organisation = await prisma.organisation.findUnique({
        where: { id: organisationId },
        select: { id: true, name: true }
    })

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Invite expires in 7 days

    await prisma.invite.create({
        data: {
            email: email,
            role: role as ProjectRole,
            projectId: projectId,
            organizationId: organisationId,
            token: inviteToken,
            expiresAt: expiresAt,
        }
    })

    await getQueues(JobName.SEND_INVITE_EMAIL).add(JobName.SEND_INVITE_EMAIL, {
        email: email,
        inviterName: inviter?.name || "A Team Member",
        organisationName: organisation?.name || "Our Organisation",
        projectName: project.name,
        role: role,
        inviteToken: inviteToken,
    })

    await CacheDelete(Cachekeys.project(projectId));

    return { message: "Invite sent successfully" };
}

export async function listInvites(projectId: string, organisationId: string) {

    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId },
        select: { id: true }
    })

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const cachedInvites = await CacheGet<{
        id: string;
        email: string;
        role: string;
        expiresAt: Date;
        createdAt: Date;
    }[]>(Cachekeys.projectInvites(projectId))

    if (cachedInvites) {
        return cachedInvites;
    }

    const invites = await prisma.invite.findMany({
        where: {
            projectId: projectId,
            expiresAt: {
                gt: new Date(),
            }
        },
        select: {
            id: true,
            email: true,
            role: true,
            expiresAt: true
        }
    })

    await CacheSet(Cachekeys.projectInvites(projectId), invites, TTL.PROJECT)

    return invites;
}

export async function resendInvites(inviteId: string, projectId: string, organisationId: string, requestingUserId: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId },
        select: { id: true, name: true }
    })

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const invite = await prisma.invite.findUnique({
        where: { id: inviteId, projectId: projectId },
        select: {
            id: true,
            email: true,
            role: true,
        }
    })

    if (!invite) {
        throw new AppError("Invite not found", 404);
    }

    const inviter = await prisma.user.findUnique({
        where: { id: requestingUserId },
        select: { name: true }
    })

    const organisation = await prisma.organisation.findUnique({
        where: { id: organisationId },
        select: { name: true }
    })

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Invite expires in 7 days

    await prisma.invite.update({
        where: { id: inviteId },
        data: {
            token: inviteToken,
            expiresAt: expiresAt,
        },
    })

    await getQueues(JobName.SEND_INVITE_EMAIL).add(JobName.SEND_INVITE_EMAIL, {
        email: invite.email,
        inviterName: inviter?.name || "A Team Member",
        organisationName: organisation?.name || "Our Organisation",
        projectName: project.name,
        role: invite.role,
        inviteToken: inviteToken,
    })

    await CacheDelete(Cachekeys.projectInvites(projectId));

    return { message: "Invite resent successfully" };
}

export async function cancelInvite(inviteId: string, projectId: string, organisationId: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId },
        select: { id: true }
    })

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const invite = await prisma.invite.findUnique({
        where: { id: inviteId, projectId: projectId },
        select: { id: true }
    })

    if (!invite) {
        throw new AppError("Invite not found", 404);
    }

    await prisma.invite.delete({
        where: { id: inviteId }
    })

    await CacheDelete(Cachekeys.projectInvites(projectId));

    return { message: "Invite cancelled successfully" };
}

export async function acceptInvite(inviteToken: string, name: string, phone: string, password: string) {
    const invite = await prisma.invite.findUnique({
        where: { token: inviteToken },
        select: {
            id: true,
            email: true,
            role: true,
            projectId: true,
            organizationId: true,
            expiresAt: true,
        }
    })

    if (!invite) {
        throw new AppError("Invalid invite token", 400);
    }

    if (invite.expiresAt < new Date()) {
        throw new AppError("Invite token has expired, please rerquest the admin to resend the invite", 400);
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: invite.email },
        select: { id: true }
    })

    if (existingUser) {
        throw new AppError("A user with this email already exists, please login to your account and access the project from there", 409);
    }

    const organisation = await prisma.organisation.findUnique({
        where: { id: invite.organizationId },
        select: { name: true }
    })

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name: name,
                email: invite.email,
                phone: phone,
                password: hashedPassword,
                role: "MEMBER",
                organisationId: invite.organizationId,
                emailVerified: true,
            },
            select: {
                id: true, name: true, email: true
            }
        })
        tx.projectMember.create({
            data: {
                userId: user.id,
                projectId: invite.projectId,
                role: invite.role
            }
        })

        tx.invite.delete({
            where: { id: invite.id }
        })

        return user;
    })

    await getQueues(JobName.SEND_WELCOME_EMAIL).add(JobName.SEND_WELCOME_EMAIL, {
        email: user.email,
        name: user.name,
        organizationName: organisation?.name || "Our Organisation",
        userId: user.id,
    })

    CacheDelete(Cachekeys.project(invite.projectId));
    CacheDelete(Cachekeys.projectInvites(invite.projectId));

    return { message: "Account created successfully. You can now log in." };
}