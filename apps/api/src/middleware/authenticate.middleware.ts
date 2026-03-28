import { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/app-error";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
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
        req.user = verifyAccessToken(token);
        next();
    } catch (error) {
        next(new AppError("Invalid or expired access token", 401));
    }
}