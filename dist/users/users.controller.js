"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const client_1 = require("../prisma/client");
const getUsers = async (req, res) => {
    const users = await client_1.prisma.user.findMany();
    res.json(users);
};
exports.getUsers = getUsers;
