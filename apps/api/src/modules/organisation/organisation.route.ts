import { Router } from "express";

import * as organisationController from "./organisation.controller";
import { authenticate } from "../../middleware/authenticate.middleware";
import { verifyRole } from "../../middleware/user-role.middleware";

export const organisationRouter: Router = Router();

organisationRouter.get("/", authenticate, organisationController.getOrganisation);
organisationRouter.get("/members", authenticate, organisationController.getOrganisationMembers);
organisationRouter.delete("/members/:userId", authenticate, verifyRole("OWNER"), organisationController.removeOrganisationMember);
organisationRouter.delete("/", authenticate, verifyRole("OWNER"), organisationController.deleteOrganisation);