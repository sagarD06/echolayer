import { Router } from "express";

import * as authController from "./auth.controller";
import { authenticate } from "../../middleware/authenticate.middleware";
import { authRateLimiter } from "../../middleware/rate-limit.middleware";
import { validate } from "../../middleware/validate-schema.middleware";
import { forgotPasswordSchema, LoginSchema, RegisterSchema, resetPasswordSchema } from "@echolayer/schema";

export const authRouter: Router = Router();

/* Public Routes */
authRouter.post("/register", authRateLimiter, validate(RegisterSchema), authController.register);

authRouter.get("/verify-email", authController.verifyEmail);

authRouter.post("/login", authRateLimiter, validate(LoginSchema), authController.login);

authRouter.post("/forgot-password", authRateLimiter,validate(forgotPasswordSchema), authController.forgotPassword);

authRouter.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

authRouter.post("/refresh", authController.refresh);


/* Protected Routes */

authRouter.post("/logout", authenticate, authController.logout);

authRouter.get("/me", authenticate, authController.me);