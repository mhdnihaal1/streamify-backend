import { Router } from "express";
import {
  createOrganization,
  createGroup,
  createMember,
  sendMessage,
  Organization,
  group,
  messages,
  addMembersToOrg,
  addMembersToGrp,
  grpMembers,
  groupMember,
  removeMember
} from "./groups.controller";

const router = Router();
router.post("/createOrg", createOrganization);
router.post("/organization", Organization); //get org by id

router.post("/group", group); //get group by admin
router.post("/groupMember", groupMember); //get group by admin
router.post("/createGrp", createGroup);

router.post("/createMember", createMember);
router.post("/grpMembers", grpMembers);
router.post("/removeMember", removeMember);

router.post("/sendMessage", sendMessage); // create message
router.post("/messages", messages); //get messages by id

router.post("/add-members", addMembersToOrg); //get org by id
router.post("/addGrp-members", addMembersToGrp); //get group by id

export default router;
