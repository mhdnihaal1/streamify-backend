import { Router } from "express";
import {
  createOrganization,
  createGroup,
  createMember,
  sendMessage,
  Organization,
  group,
  groups,
  messages,
  addMembersToOrg,
  addMembersToGrp,
   groupMember,
  removeMember,
  organizationById,
  removeUsers,
  groupById
} from "./groups.controller";

const router = Router();
router.post("/createOrg", createOrganization);
router.get("/organization", Organization); //get org by id
router.post("/organizationById", organizationById); //get org by id

router.post("/group", group); //get group by admin
router.post("/groups", groups); //get group by admin
router.post("/groupById", groupById); //get group by admin
router.post("/groupMember", groupMember); 
router.post("/createGrp", createGroup);

router.post("/createMember", createMember);
 router.post("/removeMember", removeMember);
router.post("/removeUsers", removeUsers);

router.post("/sendMessage", sendMessage); // create message
router.post("/messages", messages); //get messages by id

router.post("/add-members", addMembersToOrg); //get org by id
router.post("/addGrp-members", addMembersToGrp); //get group by id

export default router;
