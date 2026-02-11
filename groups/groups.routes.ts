import { Router } from "express";
import {
  createOrganization,
  createGroup,
  sendMessage,
  groups,
  messages,
  addMembersToGrp,
  removeMember,
  organizationById,
  groupById,
} from "./groups.controller";

const router = Router();
router.post("/createOrg", createOrganization);
router.post("/organizationById", organizationById);

router.post("/createGrp", createGroup);
router.post("/groups", groups);
router.post("/groupById", groupById);

router.post("/addGrp-members", addMembersToGrp);
router.post("/removeMember", removeMember);

router.post("/sendMessage", sendMessage);
router.post("/messages", messages);


export default router;
