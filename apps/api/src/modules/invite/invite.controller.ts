import { NextFunction, Request, Response } from "express";

import * as inviteService from "./invite.service";

export async function sendInvites(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await inviteService.sendInvite(req.params.projectId as string, req.user!.organisationId, req.body.email, req.user!.userId, req.body.role);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getInvites(req: Request, res: Response, next: NextFunction) {
    try {
        const invites = await inviteService.listInvites(req.params.projectId as string, req.user!.organisationId);

        res.status(200).json({ invites });
    } catch (error) {
        next(error);
    }
}

export async function resendInvites(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await inviteService.resendInvites(req.params.inviteId as string, req.params.projectId as string, req.user!.organisationId, req.user!.userId);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function cancelInvites(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await inviteService.cancelInvite(req.params.inviteId as string, req.params.projectId as string, req.user!.organisationId);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function acceptInvites(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await inviteService.acceptInvite(req.body.token, req.body.name, req.body.phone, req.body.password);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}