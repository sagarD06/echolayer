import { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/app-error";
import { getCurrentUser } from "../modules/user/user.service";
import { Role } from "@echolayer/database";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                organisationId: string;
                role: Role;
            }
        }
    }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return next(new AppError("Missing or malformed Authorization header", 401));
    }

    const token = authHeader.slice(7);
    try {
        const payload = verifyAccessToken(token);

        const user = await getCurrentUser(payload.userId);

        req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
            organisationId: user.organisationId,
        };

        next();
    } catch (error) {
        next(new AppError("Invalid or expired access token", 401));
    }
}