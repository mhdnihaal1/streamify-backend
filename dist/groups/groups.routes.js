"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groups_controller_1 = require("./groups.controller");
const router = (0, express_1.Router)();
router.post("/create", groups_controller_1.createGroup);
router.post("/join", groups_controller_1.joinGroup);
exports.default = router;
