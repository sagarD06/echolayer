import { NextFunction, Request, Response } from "express";

import * as projectMemberService from "./projectMember.service";

export async function addProjectMember(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await projectMemberService.addProjectMember(req.params.projectId as string, req.user!.organisationId, req.body.email, req.body.role);

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export async function getProjectMembers(req: Request, res: Response, next: NextFunction) {
    try {
        const members = await projectMemberService.getAllProjectMembers(req.params.projectId as string, req.user!.organisationId);

        res.status(200).json({ members });
    } catch (error) {
        next(error);
    }
}

export async function updateProjectMemberRole(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await projectMemberService.updateProjectMemberRole(req.params.projectId as string, req.user!.organisationId, req.params.userId as string, req.user!.userId, req.body.role);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function removeProjectMember(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await projectMemberService.removeProjectMember(req.params.projectId as string, req.user!.organisationId, req.params.userId as string, req.user!.userId);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}