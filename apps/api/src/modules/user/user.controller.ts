import { NextFunction, Request, Response } from "express";
import * as userService from "./user.service";

export async function me(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await userService.getCurrentUser(req.user!.userId);
        res.json({ user });
    } catch (error) {
        next(error)
    }
}