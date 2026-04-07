import { Router } from "express";

import { CreateFeedbackSchema, listFeedbacksSchema, updateFeedbackStatusSchema } from "@echolayer/schema";

import * as feedbackController from "./feedback.controller";
import { authenticate } from "../../middleware/authenticate.middleware";
import { validate } from "../../middleware/validate-schema.middleware";
import { verifyProjectAccess } from "../../middleware/verifyProjectAccess.middleware";

export const feedbackRouter: Router = Router();

/* public route */

feedbackRouter.post("/:projectId", validate(CreateFeedbackSchema), feedbackController.createFeedback);

/* protected routes */
feedbackRouter.get("/projects/:projectId",
    (req, _res, next) => {
        Object.defineProperty(req, 'query', { ...Object.getOwnPropertyDescriptor(req, 'query'), value: req.query, writable: true });
        next();
    },
    authenticate, verifyProjectAccess(), validate(listFeedbacksSchema), feedbackController.listFeedbacks);

feedbackRouter.put("/:feedbackId/status", authenticate, verifyProjectAccess(), validate(updateFeedbackStatusSchema), feedbackController.updateFeedbackStatus);

feedbackRouter.delete("/:feedbackId", authenticate, verifyProjectAccess(), feedbackController.deleteFeedback);

feedbackRouter.get("/projects/:projectId/export", authenticate, verifyProjectAccess(), feedbackController.exportFeedbacks);