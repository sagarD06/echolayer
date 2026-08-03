import { NextFunction, Request, Response } from "express";

import * as projectService from "./project.service";

export async function createProject(req: Request, res: Response, next: NextFunction) {
    try {
        const project = await projectService.createProject(req.user!.organisationId, req.user!.userId, req.body);

        res.status(201).json({ project });
    } catch (error) {
        next(error);
    }
}

export async function getProjects(req: Request, res: Response, next: NextFunction) {
    try {
        const projects = await projectService.getProjects(req.user!.organisationId, req.user!.userId, req.user!.role);

        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
}

export async function getProject(req: Request, res: Response, next: NextFunction) {
    try {
        const project = await projectService.getProjectById(req.params.projectId as string, req.user!.organisationId);

        res.status(200).json({ project });
    } catch (error) {
        next(error);
    }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
    try {
        const project = await projectService.updateProject(req.params.projectId as string, req.user!.organisationId, req.user!.userId, req.body.name);

        res.status(200).json({ project });
    } catch (error) {
        next(error);
    }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await projectService.deleteProject(req.params.projectId as string, req.user!.organisationId);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}