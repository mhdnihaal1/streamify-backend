"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected");
        socket.on("message", (data) => {
            io.emit("message", data);
        });
    });
};
exports.setupSocket = setupSocket;
