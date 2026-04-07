import { Router } from "express";

import { addProjectMemberSchema, createProjectSchema, updateProjectMemberRoleSchema, updateProjectSchema } from "@echolayer/schema";

import * as projectController from "./project.controller";
import * as projectMemberController from "./projectMember.controller";

import { authenticate } from "../../middleware/authenticate.middleware";
import { verifyRole } from "../../middleware/user-role.middleware";
import { validate } from "../../middleware/validate-schema.middleware";
import { verifyProjectAccess } from "../../middleware/verifyProjectAccess.middleware";

export const projectRouter: Router = Router();

projectRouter.use(authenticate);

/* Project Routes */
projectRouter.post("/", verifyRole("OWNER"), validate(createProjectSchema), projectController.createProject);

projectRouter.get("/", projectController.getProjects);
projectRouter.get("/:projectId", projectController.getProject);

projectRouter.put("/:projectId", verifyProjectAccess(), validate(updateProjectSchema), projectController.updateProject);

projectRouter.delete("/:projectId", verifyRole("OWNER"), projectController.deleteProject);

/* Project Member Routes */
projectRouter.post("/:projectId/members", verifyProjectAccess(), validate(addProjectMemberSchema), projectMemberController.addProjectMember);

projectRouter.get("/:projectId/members", projectMemberController.getProjectMembers);

projectRouter.put("/:projectId/members/:userId", verifyProjectAccess(), validate(updateProjectMemberRoleSchema), projectMemberController.updateProjectMemberRole);

projectRouter.delete("/:projectId/members/:userId", verifyProjectAccess(), projectMemberController.removeProjectMember);