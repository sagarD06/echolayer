import { NextFunction, Request, Response } from "express";

import * as feedbackService from "./feedback.service";

export async function createFeedback(req: Request, res: Response, next: NextFunction) {
    try {
        const feedback = await feedbackService.createFeedback(req.body.projectId, req.body);

        res.status(201).json(feedback);
    } catch (error) {
        next(error);
    }
};

export async function listFeedbacks(req: Request, res: Response, next: NextFunction) {
    try {
        const limit = Number(req.query.limit) || 20;
        const cursor = req.query.cursor as string | undefined;

        const feedbacks = await feedbackService.listFeedbacks(req.params.projectId as string, req.user!.organisationId, limit, cursor);

        res.status(200).json(feedbacks);
    } catch (error) {
        next(error);
    }
};

export async function updateFeedbackStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const feedback = await feedbackService.updateFeedbackStatus(req.user!.organisationId, req.params.feedbackId as string, req.body.status);

        res.status(200).json(feedback);

    } catch (error) {
        next(error);
    }
};

export async function deleteFeedback(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await feedbackService.deleteFeedback(req.params.feedbackId as string, req.user!.organisationId);

        res.status(204).json(result);
    } catch (error) {
        next(error);
    }
};

export async function exportFeedbacks(req: Request, res: Response, next: NextFunction) {
    try {
        const buffer = await feedbackService.exportFeedbackToExcel(req.params.projectId as string, req.user!.organisationId);

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="feedback-${req.params.projectId}.xlsx"`
        );

        res.status(200).send(buffer);
    } catch (error) {
        next(error);
    }
};