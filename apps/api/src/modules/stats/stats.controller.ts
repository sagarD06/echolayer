import { NextFunction, Request, Response } from "express";

import * as statsService from "./stats.service";

export async function getOrganisationStats(req: Request, res: Response, next: NextFunction) {
    try {

        const days = Number(req.query.days) || 30;

        const stats = await statsService.getOrganisationStats(req.user!.organisationId, days)

        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};

export async function getProjectStats(req: Request, res: Response, next: NextFunction) {
    try {

        const days = Number(req.query.days) || 30;

        const stats = await statsService.getProjectStats(req.params.projectId as string, req.user!.organisationId, days)

        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};