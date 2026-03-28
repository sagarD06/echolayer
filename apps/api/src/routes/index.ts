import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";

export const appRouter: Router = Router();

appRouter.use("/auth", authRouter);