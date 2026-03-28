import { NextFunction, Request, Response } from "express";
import {z} from "zod";



export function validate(schema: z.ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query
        })

        if (!result.success) {
            const errors = result.error?.issues.map((e) => ({
                field: e.path.slice(1).join("."),
                message: e.message,
            }));
            return res.status(400).json({ error: "Validation failed", errors });
        }

        Object.assign(req, result.data);
        next();
    }
};