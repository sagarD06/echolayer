import { NextFunction, Request, Response } from "express";

import { prisma } from "@echolayer/database";

import { AppError } from "../utils/app-error";

export function verifyProjectAccess() {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const { role, userId } = req.user!;
        const { projectId } = req.params as { projectId: string };

        if (role === "OWNER") {
            return next();
        }

        if (role === "ADMIN") {
            const membership = await prisma.projectMember.findUnique({
                where: {
                    userId_projectId: {
                        userId: userId,
                        projectId: projectId,
                    }
                }
            })

            if (!membership || membership.role !== "ADMIN") {
                return next(new AppError("Forbidden — you are not an admin of this project", 403));
            }

            return next();
        }

        return next(new AppError("Forbidden — you are not an admin of this project", 403));

    }
}