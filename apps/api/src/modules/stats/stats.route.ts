import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.middleware";

import * as statController from "./stats.controller";
import { verifyProjectAccess } from "../../middleware/verifyProjectAccess.middleware";

export const statRouter: Router = Router();

statRouter.use(authenticate);

statRouter.get("/org", statController.getOrganisationStats);

statRouter.get("/:projectId", verifyProjectAccess(), statController.getProjectStats)