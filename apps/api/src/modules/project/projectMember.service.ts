import crypto from "crypto";
import { prisma, ProjectRole, Role } from "@echolayer/database";
import { CacheDelete, Cachekeys, CacheSet, CahceGet, TTL } from "@echolayer/cache";

import { AppError } from "../../utils/app-error";
import { getQueues, JobName } from "@echolayer/queues";

export async function addProjectMember(projectId: string, organisationId: string, email: string, role: Role | ProjectRole) {
    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId }
    })

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const user = await prisma.user.findUnique({
        where: { email: email },
        select: {
            id: true,
            organisationId: true,
        }
    })

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.organisationId !== organisationId) {
        throw new AppError("User does not belong to the organisation", 400);
    }

    const existingMember = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: user.id,
                projectId: projectId,
            }
        }
    })

    if (existingMember) {
        throw new AppError("User is already a member of the project", 400);
    }

    await prisma.projectMember.create({
        data: {
            userId: user.id,
            projectId: projectId,
            role: role as ProjectRole,
        }
    })

    await CacheDelete(Cachekeys.project(projectId));

    return { message: "Project member added successfully" };
}

export async function removeProjectMember(projectId: string, organisationId: string, targetUserId: string, requestingUserId: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId },
        select: { id: true }
    })

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    if (targetUserId === requestingUserId) {
        throw new AppError("Users cannot remove themselves from a project", 400);
    }

    const membership = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: targetUserId,
                projectId: projectId,
            }
        }
    })

    if (!membership) {
        throw new AppError("User is not a member of the project", 404);
    }

    await prisma.projectMember.delete({
        where: {
            userId_projectId: {
                userId: targetUserId,
                projectId: projectId,
            }
        }
    })

    await CacheDelete(Cachekeys.project(projectId));

    return { message: "Project member removed successfully" };
}

export async function updateProjectMemberRole(projectId: string, organisationId: string, targetUserId: string, requestingUserId: string, newRole: Role | ProjectRole) {
    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId },
        select: { id: true }
    })

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    if (targetUserId === requestingUserId) {
        throw new AppError("Users cannot change their own role in a project", 400);
    }

    const membership = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: targetUserId,
                projectId: projectId,
            }
        }
    })

    if (!membership) {
        throw new AppError("User is not a member of the project", 404);
    }

    const updatedMembership = await prisma.projectMember.update({
        where: {
            userId_projectId: {
                userId: targetUserId,
                projectId: projectId,
            }
        },
        data: {
            role: newRole as ProjectRole,
        },
        select: {
            userId: true,
            projectId: true,
            role: true,
        }
    })

    await CacheDelete(Cachekeys.project(projectId));

    return updatedMembership;
}

export async function getAllProjectMembers(projectId: string, organisationId: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId },
        select: { id: true }
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const cached = await CahceGet<{
        id: string;
        name: string;
        email: string;
        phone: string;
        projectRole: string;
    }[]>(Cachekeys.projectMembers(projectId));

    if (cached) {
        return cached;
    }

    const members = await prisma.projectMember.findMany({
        where: { projectId: projectId },
        select: {
            role: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                }
            }
        }
    });

    const flattened = members.map(member => (
        {
            id: member.user.id,
            name: member.user.name,
            email: member.user.email,
            phone: member.user.phone,
            role: member.role,
        }
    ));

    await CacheSet(Cachekeys.projectMembers(projectId), flattened, TTL.PROJECT_MEMBERS);

    return flattened;
};