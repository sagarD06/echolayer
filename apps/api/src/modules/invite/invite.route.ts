import { Router } from "express";

import * as inviteControllers from "./invite.controller";
import { authenticate } from "../../middleware/authenticate.middleware";
import { validate } from "../../middleware/validate-schema.middleware";
import { acceptInviteSchema, sendInviteSchema } from "@echolayer/schema";
import { verifyProjectAccess } from "../../middleware/verifyProjectAccess.middleware";

export const inviteRouter: Router = Router();

inviteRouter.use(authenticate);

/* public route */
inviteRouter.post("/accept-invite", validate(acceptInviteSchema), inviteControllers.acceptInvites);

/* authenticated routes */
inviteRouter.post("/projects/:projectId/send-invites", authenticate, verifyProjectAccess(), validate(sendInviteSchema), inviteControllers.sendInvites);

inviteRouter.get("/projects/:projectId/get-invites", authenticate, verifyProjectAccess(), inviteControllers.getInvites);

inviteRouter.post("/projects/:projectId/resend-invites/:inviteId", authenticate, verifyProjectAccess(), inviteControllers.resendInvites);

inviteRouter.post("/projects/:projectId/cancel-invites/:inviteId", authenticate, verifyProjectAccess(), inviteControllers.cancelInvites);