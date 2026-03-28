import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ err: err.message });
    }

    console.log("[Unhandled Error]", err);

    res.status(500).json({ error: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message });
};