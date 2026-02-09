"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUsers = exports.removeMember = exports.addMembersToGrp = exports.addMembersToOrg = exports.messages = exports.groupMember = exports.groups = exports.group = exports.organizationById = exports.Organization = exports.sendMessage = exports.createMember = exports.createGroup = exports.createOrganization = void 0;
const client_1 = require("../prisma/client");
const createOrganization = async (req, res) => {
    try {
        const { name, userId } = req.body;
        const org = await client_1.prisma.organization.findFirst({
            where: { id: userId },
        });
        if (org) {
            return res.status(401).json({ message: "Organization already exists" });
        }
        const orgs = await client_1.prisma.organization.create({
            data: {
                name,
            },
        });
        await client_1.prisma.user.update({
            where: { id: userId },
            data: {
                orgId: orgs.id,
            },
        });
        res.json({ message: "Organization created successfully", data: orgs });
    }
    catch (error) {
        console.error("Organization creation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createOrganization = createOrganization;
const createGroup = async (req, res) => {
    try {
        const { name, orgId, userId } = req.body;
        if (!name || !orgId || !userId) {
            return res
                .status(400)
                .json({ message: "name, orgId and userId are required" });
        }
        const existingGroup = await client_1.prisma.group.findFirst({
            where: { name, orgId },
        });
        if (existingGroup) {
            return res.status(401).json({ message: "Group already exists" });
        }
        const group = await client_1.prisma.group.create({
            data: {
                name,
                orgId,
                ownerId: userId,
            },
        });
        const groupMember = await client_1.prisma.groupMember.create({
            data: { userId, groupId: group.id },
        });
        res.status(201).json({ message: "Group created successfully", data: group });
    }
    catch (error) {
        console.error("Group creation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createGroup = createGroup;
const createMember = async (req, res) => {
    try {
        const { userId, groupId } = req.body;
        if (!userId || !groupId) {
            return res.status(400).json({
                message: "userId and groupId are required",
            });
        }
        const existMember = await client_1.prisma.groupMember.findFirst({
            where: { userId, groupId },
        });
        if (existMember) {
            return res
                .status(401)
                .json({ message: "User is already a member of this group" });
        }
        const groupMember = await client_1.prisma.groupMember.create({
            data: { userId, groupId },
        });
        res.json({ message: "Joined group", data: groupMember });
    }
    catch (error) {
        console.error("Group member creation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createMember = createMember;
const sendMessage = async (req, res) => {
    try {
        const { senderId, groupId, text } = req.body;
        if (!senderId || !groupId || !text) {
            return res.status(400).json({
                message: "senderId, groupId and text are required",
            });
        }
        const message = await client_1.prisma.message.create({
            data: { senderId, groupId, text },
        });
        res.json({ message: "Message sended successfully", data: message });
    }
    catch (error) {
        console.error("Message sending error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.sendMessage = sendMessage;
const Organization = async (req, res) => {
    try {
        const organizations = await client_1.prisma.organization.findMany({
            include: {
                groups: true,
                users: true,
            },
        });
        return res.status(200).json({ Success: true, data: organizations });
    }
    catch (error) {
        console.error("Message sending error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.Organization = Organization;
const organizationById = async (req, res) => {
    try {
        const { orgId } = req.body;
        const organizations = await client_1.prisma.organization.findFirst({
            where: { id: orgId },
            include: {
                groups: true,
                users: true,
            },
        });
        return res.status(200).json({ Success: true, data: organizations });
    }
    catch (error) {
        console.error("Message sending error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.organizationById = organizationById;
const group = async (req, res) => {
    try {
        const { groupId } = req.body;
        if (!groupId) {
            return res.status(400).json({
                message: "groupId is required",
            });
        }
        const groups = await client_1.prisma.groupMember.findMany({
            where: { groupId: groupId },
            include: {
                group: true,
                user: true,
            },
        });
        return res.status(200).json({ Success: true, data: groups });
    }
    catch (error) {
        console.error("Message sending error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.group = group;
const groups = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                message: "userId is required",
            });
        }
        const groups = await client_1.prisma.groupMember.findMany({
            where: { userId: userId },
            include: {
                group: true,
                user: true,
            },
        });
        return res.status(200).json({ Success: true, data: groups });
    }
    catch (error) {
        console.error("Message sending error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.groups = groups;
const groupMember = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("Received groupId12:", userId);
        if (!userId) {
            return res.status(400).json({
                message: "userId is required",
            });
        }
        const groupMember = await client_1.prisma.groupMember.findMany({
            where: { userId: userId },
            include: {
                user: true,
                group: true,
            },
        });
        console.log(123, groupMember);
        return res.status(200).json({ Success: true, data: groupMember });
    }
    catch (error) {
        console.error("Message sending error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.groupMember = groupMember;
const messages = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        if (!groupId) {
            return res.status(400).json({
                message: "groupId and userId are required",
            });
        }
        const messages = await client_1.prisma.message.findMany({
            where: { groupId },
        });
        return res.status(200).json({ Success: true, data: messages });
    }
    catch (error) {
        console.error("Message sending error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.messages = messages;
const addMembersToOrg = async (req, res) => {
    try {
        const { userIds, orgId } = req.body;
        if (!orgId || !userIds) {
            return res.status(400).json({ message: "Organization  ID required" });
        }
        const org = await client_1.prisma.organization.findUnique({
            where: { id: orgId },
        });
        if (!org) {
            return res.status(404).json({ message: "Organization not found" });
        }
        const updatedUsers = await client_1.prisma.user.updateMany({
            where: {
                id: { in: userIds },
            },
            data: {
                orgId: orgId,
            },
        });
        return res.status(200).json({
            message: "Users added to organization successfully",
            org: org,
        });
    }
    catch (error) {
        console.error("Add members error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.addMembersToOrg = addMembersToOrg;
const addMembersToGrp = async (req, res) => {
    try {
        const { userId, groupId } = req.body;
        if (!userId || !groupId) {
            return res
                .status(400)
                .json({ message: "Organization, Group and User IDs are required" });
        }
        const existingMember = await client_1.prisma.groupMember.findFirst({
            where: {
                userId,
                groupId,
            },
        });
        if (existingMember) {
            return res.status(400).json({
                message: "Member already exists in this group",
            });
        }
        const grpMember = await client_1.prisma.groupMember.create({
            data: {
                userId,
                groupId,
            },
        });
        return res.status(200).json({
            message: "Users added to group successfully",
            groupMember: grpMember,
        });
    }
    catch (error) {
        console.error("Add members error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.addMembersToGrp = addMembersToGrp;
const removeMember = async (req, res) => {
    try {
        const { useri, groupId, adminId } = req.body;
        if (!useri || !groupId || !adminId) {
            return res.status(400).json({
                message: "userId, groupId and adminId are required",
            });
        }
        const membership = await client_1.prisma.groupMember.findFirst({
            where: {
                userId: useri,
                groupId,
            },
        });
        if (!membership) {
            return res.status(404).json({
                message: "User is not a member of this group",
            });
        }
        await client_1.prisma.groupMember.delete({
            where: {
                id: membership.id,
            },
        });
        return res.status(200).json({
            message: "User removed from group successfully",
        });
    }
    catch (error) {
        console.error("Remove member error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.removeMember = removeMember;
const removeUsers = async (req, res) => {
    try {
        const { groupId, adminId, orgId } = req.body;
        if (!groupId || !adminId || !orgId) {
            return res.status(400).json({
                message: "  groupId, adminId and orgId are required",
            });
        }
        const organization = await client_1.prisma.organization.findFirst({
            where: { id: orgId },
            include: {
                groups: {
                    include: {
                        members: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });
        return res.status(200).json({
            message: "User removed from group successfully",
        });
    }
    catch (error) {
        console.error("Remove member error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.removeUsers = removeUsers;
