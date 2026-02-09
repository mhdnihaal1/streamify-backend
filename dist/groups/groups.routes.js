"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groups_controller_1 = require("./groups.controller");
const router = (0, express_1.Router)();
router.post("/createOrg", groups_controller_1.createOrganization);
router.get("/organization", groups_controller_1.Organization); //get org by id
router.post("/organizationById", groups_controller_1.organizationById); //get org by id
router.post("/group", groups_controller_1.group); //get group by admin
router.post("/groups", groups_controller_1.groups); //get group by admin
router.post("/groupMember", groups_controller_1.groupMember);
router.post("/createGrp", groups_controller_1.createGroup);
router.post("/createMember", groups_controller_1.createMember);
router.post("/removeMember", groups_controller_1.removeMember);
router.post("/removeUsers", groups_controller_1.removeUsers);
router.post("/sendMessage", groups_controller_1.sendMessage); // create message
router.post("/messages", groups_controller_1.messages); //get messages by id
router.post("/add-members", groups_controller_1.addMembersToOrg); //get org by id
router.post("/addGrp-members", groups_controller_1.addMembersToGrp); //get group by id
exports.default = router;
