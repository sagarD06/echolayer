import { NextFunction, Request, Response } from "express";

import * as organsiationService from "./organisation.service";
import { AppError } from "../../utils/app-error";

export async function getOrganisation(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user;
        if (!user?.organisationId) {
            throw new AppError("User does not belong to any organisation", 400);
        }
        const organisation = await organsiationService.getOrganisation(user.organisationId);

        res.status(200).json({ organisation });

    } catch (error) {
        next(error);
    }
}

export async function getOrganisationMembers(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user;
        if (!user?.organisationId) {
            throw new AppError("User does not belong to any organisation", 400);
        }
        const members = await organsiationService.getAllOrganisationMembers(user.organisationId);

        res.status(200).json({ members });
    } catch (error) {
        next(error);
    }
}

export async function removeOrganisationMember(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user;
        if (!user?.organisationId) {
            throw new AppError("User does not belong to any organisation", 400);
        }
        if (!user?.userId) {
            throw new AppError("User does not have a valid ID", 400);
        }

        const targetUserId = req.params.userId as string;

        if (!targetUserId) {
            throw new AppError("Target user ID is required", 400);
        }

        const result = await organsiationService.removeMemberFromOrganisation(user.organisationId, user.userId, targetUserId);

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}

export async function deleteOrganisation(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user;
        if (!user?.organisationId) {
            throw new AppError("User does not belong to any organisation", 400);
        }

        await organsiationService.deleteOrganisation(user.organisationId);

        res.status(200).json({ message: "Organisation deleted successfully" });

    } catch (error) {
        next(error);
    }
}