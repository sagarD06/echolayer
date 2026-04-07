import { prisma, Project, ProjectRole, Role } from "@echolayer/database";
import { CacheDelete, Cachekeys, CacheSet, CacheGet, TTL } from "@echolayer/cache";

import { AppError } from "../../utils/app-error";

export async function createProject(organisationId: string, userId: string, body: {name: string}) {
    if (!body.name) {
        throw new AppError("Project name is required", 400);
    }

    const project = await prisma.project.create({
        data: {
            name: body.name,
            organisationId: organisationId,
            createdBy: userId,
        },
        select: {
            id: true,
            name: true,
            organisationId: true,
            createdBy: true,
            createdAt: true,
        }
    })

    await CacheDelete(Cachekeys.orgProjects(organisationId));

    return project;
}

export async function getProjects(organisationId: string, userId: string, role: Role | ProjectRole) {
    if (role === "OWNER") {
        const projectCache = await CacheGet<Project[]>(Cachekeys.orgProjects(organisationId))

        if (projectCache) {
            return projectCache;
        }

        const projects = await prisma.project.findMany({
            where: { organisationId: organisationId },
            select: {
                id: true,
                name: true,
                organisationId: true,
                createdBy: true,
                createdAt: true,
            }
        })
        await CacheSet(Cachekeys.orgProjects(organisationId), projects, TTL.PROJECT);
        return projects;
    }

    if (role === "ADMIN" || role === "MEMBER") {
        const projectMembers = await prisma.projectMember.findMany({
            where: { userId: userId, organisationId: organisationId },
            select: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        organisationId: true,
                        createdBy: true,
                        createdAt: true,
                    }
                }
            }
        })

        return projectMembers.map((member) => member.project);
    }
}

export async function getProjectById(projectId: string, organisationId: string) {
    const cachedProject = await CacheGet<Project>(Cachekeys.project(projectId));

    if (cachedProject) {
        return cachedProject;
    }

    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId },
        select: {
            id: true,
            name: true,
            organisationId: true,
            createdBy: true,
            createdAt: true,
            members: {
                select: {
                    role: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        }
                    }
                }
            }
        }
    })

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    await CacheSet(Cachekeys.project(projectId), project, TTL.PROJECT);

    return project;
}

export async function updateProject(projectId: string, organisationId: string, userId: string, updatedName: string) {
    if (!updatedName) {
        throw new AppError("Project name is required", 400);
    }

    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId }
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { name: updatedName, updatedBy: userId },
        select: {
            id: true,
            name: true,
            organisationId: true,
            createdBy: true,
            createdAt: true,
        }
    });

    await CacheDelete(Cachekeys.project(projectId));
    await CacheDelete(Cachekeys.orgProjects(organisationId));

    await CacheSet(Cachekeys.project(projectId), updatedProject, TTL.PROJECT);

    return updatedProject;
}

export async function deleteProject(projectId: string, organisationId: string) {

    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId }
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    await prisma.project.delete({
        where: { id: projectId }
    });

    await CacheDelete(Cachekeys.project(projectId));
    await CacheDelete(Cachekeys.orgProjects(organisationId));

    return { message: "Project deleted successfully" };
}