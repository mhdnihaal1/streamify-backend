"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinGroup = exports.createGroup = void 0;
const client_1 = require("../prisma/client");
const createGroup = async (req, res) => {
    const { name, adminId } = req.body;
    const group = await client_1.prisma.group.create({
        data: {
            name,
            adminId
        }
    });
    res.json(group);
};
exports.createGroup = createGroup;
const joinGroup = async (req, res) => {
    const { userId, groupId } = req.body;
    await client_1.prisma.groupMember.create({
        data: { userId, groupId }
    });
    res.json({ message: "Joined group" });
};
exports.joinGroup = joinGroup;
