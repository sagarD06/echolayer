import ExcelJS from "exceljs";

import { FeedbackStatus, prisma } from "@echolayer/database";

import { CreateFeedbackInput } from "@echolayer/schema";
import { CacheDelete, Cachekeys } from "@echolayer/cache";

import { AppError } from "../../utils/app-error";

const STAT_DAY_VARIANTS = [7, 30, 90];

export async function createFeedback(projectId: string, feedbackData: CreateFeedbackInput) {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, organisationId: true }
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const feedback = await prisma.feedback.create({
        data: {
            title: feedbackData.body.title,
            content: feedbackData.body.content,
            status: "OPEN",
            type: feedbackData.body.type,
            projectId: projectId,
            organisationId: project.organisationId
        },
        select: {
            id: true,
            title: true,
            content: true,
            type: true,
            status: true,
            createdAt: true,
        },
    })

    await Promise.all([
        ...STAT_DAY_VARIANTS.map((d) => CacheDelete(Cachekeys.orgStats(project.organisationId, d))),
        ...STAT_DAY_VARIANTS.map((d) => CacheDelete(Cachekeys.projectStats(projectId, d))),
    ]);

    return feedback;
}

export async function listFeedbacks(projectId: string, organisationId: string, limit: number, cursor?: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId },
        select: { id: true }
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const feedbacks = await prisma.feedback.findMany({
        where: { projectId: projectId, organisationId: organisationId },
        take: limit + 1, ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            content: true,
            type: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        }
    })

    const hasNextPage = feedbacks.length > limit;
    const items = hasNextPage ? feedbacks.slice(0, -1) : feedbacks;
    const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;

    return {
        items, nextCursor, hasNextPage
    };
}

export async function updateFeedbackStatus(organisationId: string, feedbackId: string, newStatus: FeedbackStatus) {

    const feedback = await prisma.feedback.findUnique({
        where: { id: feedbackId, organisationId: organisationId },
    });

    if (!feedback) {
        throw new AppError("Feedback not found", 404);
    }

    const updatedFeedback = await prisma.feedback.update({
        where: { id: feedbackId },
        data: { status: newStatus },
        select: {
            id: true,
            title: true,
            status: true,
            updatedAt: true,
        },
    });

    await Promise.all([
        ...STAT_DAY_VARIANTS.map((d) => CacheDelete(Cachekeys.orgStats(organisationId, d))),
        ...STAT_DAY_VARIANTS.map((d) => CacheDelete(Cachekeys.projectStats(feedback.projectId, d))),
    ]);

    return updatedFeedback;
}

export async function deleteFeedback(feedbackId: string, organisationId: string) {
    const feedback = await prisma.feedback.findUnique({
        where: { id: feedbackId, organisationId: organisationId },
    });

    if (!feedback) {
        throw new AppError("Feedback not found", 404);
    }

    await prisma.feedback.delete({
        where: { id: feedbackId }
    });

    await Promise.all([
        ...STAT_DAY_VARIANTS.map((d) => CacheDelete(Cachekeys.orgStats(organisationId, d))),
        ...STAT_DAY_VARIANTS.map((d) => CacheDelete(Cachekeys.projectStats(feedback.projectId, d))),
    ]);

    return { message: "Feedback deleted successfully" };
}

export async function exportFeedbackToExcel(projectId: string, organisationId: string): Promise<ExcelJS.Buffer> {
    const project = await prisma.project.findUnique({
        where: { id: projectId, organisationId: organisationId },
        select: { id: true, name: true }
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const feedbacks = await prisma.feedback.findMany({
        where: { projectId: projectId, organisationId: organisationId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            content: true,
            type: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "EchoLayer";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(`${project.name} Feedbacks`);
    worksheet.columns = [
        { header: "ID", key: "id", width: 30 },
        { header: "Title", key: "title", width: 40 },
        { header: "Content", key: "content", width: 60 },
        { header: "Type", key: "type", width: 15 },
        { header: "Status", key: "status", width: 15 },
        { header: "Submitted At", key: "createdAt", width: 20 },
        { header: "Last Updated", key: "updatedAt", width: 20 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF0F172A" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
            bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        };
    });
    headerRow.height = 30;

    feedbacks.forEach((feedback) => {
        const row = worksheet.addRow({
            id: feedback.id,
            title: feedback.title,
            content: feedback.content,
            type: feedback.type,
            status: feedback.status,
            createdAt: feedback.createdAt.toISOString().replace("T", " ").slice(0, 19),
            updatedAt: feedback.updatedAt.toISOString().replace("T", " ").slice(0, 19),
        })

        const isEven = row.number % 2 === 0;
        row.eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: isEven ? "FFF8FAFC" : "FFFFFFFF" },
            };
            cell.alignment = { vertical: "middle", wrapText: true };
        });

        row.height = 40;
    });

    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: worksheet.columns.length },
    };

    return workbook.xlsx.writeBuffer();
}