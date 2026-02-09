"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const PORT = process.env.PORT || 3000;
// Create HTTP server
const server = (0, http_1.createServer)(app_1.default);
// Create Socket.IO server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite frontend
        methods: ["GET", "POST"],
        credentials: true,
    },
});
/* ===============================
   Socket Authentication Middleware
   =============================== */
io.use((socket, next) => {
    const userId = socket.handshake.auth?.userId;
    if (!userId) {
        return next(new Error("Unauthorized"));
    }
    socket.data.userId = userId; // safe place to store user info
    next();
});
/* ===============================
   Socket Connection
   =============================== */
io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.data.userId);
    /* Join Group */
    socket.on("joinGroup", (groupId) => {
        socket.join(`group:${groupId}`);
        console.log(`User ${socket.data.userId} joined group ${groupId}`);
    });
    /* Leave Group */
    socket.on("leaveGroup", (groupId) => {
        socket.leave(`group:${groupId}`);
    });
    /* Send Message */
    socket.on("sendMessage", async ({ groupId, message }) => {
        // 🔒 TODO: validate user belongs to group (DB)
        console.log("Socket sendMessage:", groupId, message);
        const payload = {
            ...message,
            senderId: socket.data.userId,
            groupId,
            createdAt: new Date(),
        };
        // Emit to all group members
        io.to(`group:${groupId}`).emit("receiveMessage", payload);
    });
    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.data.userId);
    });
});
/* ===============================
   Start Server (IMPORTANT)
   =============================== */
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
