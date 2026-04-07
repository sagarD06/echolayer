import { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/app-error";
import { Role } from "@echolayer/database";

export function verifyRole(roles: Role | Role[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError("Unauthorized", 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError("Forbidden - Insufficient access for the operation", 403));
        }

        next();
    }
}