import { Router } from "express";

import * as organisationController from "./organisation.controller";
import { authenticate } from "../../middleware/authenticate.middleware";
import { verifyRole } from "../../middleware/user-role.middleware";

export const organisationRouter: Router = Router();

organisationRouter.use(authenticate);

organisationRouter.get("/", organisationController.getOrganisation);

/* Role Based Access Control Routes */
organisationRouter.get("/members", verifyRole("OWNER"), organisationController.getOrganisationMembers);
organisationRouter.delete("/members/:userId", verifyRole("OWNER"), organisationController.removeOrganisationMember);
organisationRouter.delete("/", verifyRole("OWNER"), organisationController.deleteOrganisation);