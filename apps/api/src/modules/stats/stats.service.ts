import { CacheGet, Cachekeys, CacheSet, TTL } from "@echolayer/cache";
import { prisma } from "@echolayer/database";

import { AppError } from "../../utils/app-error";

type OrgStats = {
    totalFeedback: number;
    totalMembers: number;
    totalProjects: number;
    feedbackByType: Record<string, number>;
    feedbackByStatus: Record<string, number>;
    mostActiveProjects: { id: string; name: string; feedbackCount: number }[];
    feedbackTrend: { date: string; count: number }[];
};

type ProjectStats = {
    totalFeedback: number;
    totalMembers: number;
    feedbackByType: Record<string, number>;
    feedbackByStatus: Record<string, number>;
    feedbackTrend: { date: string; count: number }[];
};

export async function getOrganisationStats(organisationId: string, days: number) {
    const cached = await CacheGet<OrgStats>(Cachekeys.orgStats(organisationId, days));

    if (cached) {
        return cached;
    }

    const since = new Date();
    since.setDate(since.getDate() - days);

    const [totalFeedbacks, totalProjects, totalMembers, feedbackByType, feedbackByStatus, mostActiveProjects, feedbackTrend] = await Promise.all([
        prisma.feedback.count({
            where: { organisationId: organisationId }
        }),

        prisma.user.count({
            where: { organisationId: organisationId }
        }),

        prisma.project.count({
            where: { organisationId: organisationId }
        }),

        prisma.feedback.groupBy({
            by: ["type"],
            where: { organisationId: organisationId },
            _count: { type: true }
        }),

        prisma.feedback.groupBy({
            by: ["status"],
            where: { organisationId: organisationId },
            _count: { status: true }
        }),

        prisma.feedback.groupBy({
            by: ["projectId"],
            where: { organisationId: organisationId },
            _count: { projectId: true },
            orderBy: { _count: { projectId: "desc" } },
            take: 5
        }),

        prisma.feedback.findMany({
            where: {
                organisationId: organisationId,
                createdAt: { gte: since }
            },
            select: { createdAt: true },
            orderBy: { createdAt: "asc" }
        })
    ]);

    const projectIds = mostActiveProjects.map(project => project.projectId);
    const projects = await prisma.project.findMany({
        where: { id: { in: projectIds } },
        select: { id: true, name: true }
    });

    const projectMap = new Map(projects.map(project => [project.id, project.name]));

    const typeMap = feedbackByType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
    }, {} as Record<string, number>);

    const statusMap = feedbackByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
    }, {} as Record<string, number>);

    const activeProjects = mostActiveProjects.map(project => ({
        id: project.projectId,
        name: projectMap.get(project.projectId) ?? "Unknown",
        count: project._count.projectId
    }));

    const trendMap = new Map<string, number>();
    feedbackTrend.forEach(feedback => {
        const date = feedback.createdAt.toISOString().split("T")[0];
        trendMap.set(date!, (trendMap.get(date!) ?? 0) + 1)
    });

    const trend = [];
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        trend.push({ date: dateStr, count: trendMap.get(dateStr!) ?? 0 })
    };

    const stats = {
        totalFeedbacks,
        totalMembers,
        totalProjects,
        feedbackByType: typeMap,
        feedbackByStatus: statusMap,
        mostActiveProjects: activeProjects,
        feedbackTrend: trend,
    };

    await CacheSet(Cachekeys.orgStats(organisationId, days), stats, TTL.STATS);

    return stats;
}

export async function getProjectStats(projectId: string, organisationId: string, days: number) {
    const cached = await CacheGet<ProjectStats>(Cachekeys.projectStats(projectId, days));

    if (cached) {
        return cached
    }

    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId }
    })

    if (!project) {
        throw new AppError("Project not founnd", 404)
    }

    const since = new Date();
    since.setDate(since.getDate() - days);

    const [totalFeedbacks, totalMembers, feedbackByType, feedbackByStatus, feedbackTrend] = await Promise.all([
        prisma.feedback.count({
            where: { projectId: projectId }
        }),

        prisma.projectMember.count({
            where: { projectId: projectId }
        }),

        prisma.feedback.groupBy({
            by: ["type"],
            where: { projectId: projectId },
            _count: { type: true }
        }),

        prisma.feedback.groupBy({
            by: ["status"],
            where: { projectId: projectId },
            _count: { status: true }
        }),

        prisma.feedback.findMany({
            where: { projectId: projectId, createdAt: { gte: since } },
            select: { createdAt: true },
            orderBy: { createdAt: "asc" }
        })
    ]);

    const typeMap = feedbackByType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
    }, {} as Record<string, number>);

    const statusMap = feedbackByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
    }, {} as Record<string, number>);

    const trendMap = new Map<string, number>();
    feedbackTrend.forEach((fb) => {
        const date = fb.createdAt.toISOString().split("T")[0];
        trendMap.set(date!, (trendMap.get(date!) ?? 0) + 1);
    });

    const trend = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        trend.push({ date: dateStr, count: trendMap.get(dateStr!) ?? 0 });
    }

    const stats = {
        totalFeedbacks,
        totalMembers,
        feedbackByType: typeMap,
        feedbackByStatus: statusMap,
        feedbackTrend: trend,
    };

    await CacheSet(
        Cachekeys.projectStats(projectId, days),
        stats,
        TTL.STATS
    );

    return stats;
}