import { Router } from "express";

import * as userController from "./user.controller";
import { authenticate } from "../../middleware/authenticate.middleware";

export const userRouter: Router = Router();

userRouter.get("/me", authenticate, userController.me);