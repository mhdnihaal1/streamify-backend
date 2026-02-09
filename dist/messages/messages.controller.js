"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const client_1 = require("../prisma/client");
const sendMessage = async (senderId, groupId, text) => {
    return client_1.prisma.message.create({
        data: { senderId, groupId, text }
    });
};
exports.sendMessage = sendMessage;
