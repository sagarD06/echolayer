import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { userRouter } from "../modules/user/user.route";
import { organisationRouter } from "../modules/organisation/organisation.route";

export const appRouter: Router = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/user", userRouter);
appRouter.use("/organisation", organisationRouter);