// import { createServer } from "http";
// import { Server } from "socket.io";

// const SOCKET_PORT = process.env.SOCKET_PORT || 3001;

// // Create raw HTTP server (no Express needed)
// const httpServer = createServer();

// // Create Socket.IO server
// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:5173", // frontend
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// /* ===============================
//    Socket Auth Middleware
//    =============================== */
// io.use((socket, next) => {
//   const userId = socket.handshake.auth?.userId;

//   if (!userId) {
//     return next(new Error("Unauthorized"));
//   }

//   socket.data.userId = userId;
//   next();
// });

// /* ===============================
//    Socket Events
//    =============================== */
// io.on("connection", (socket) => {
//   console.log("✅ Socket connected:", socket.data.userId);

//   socket.on("joinGroup", (groupId: string) => {
//     socket.join(`group:${groupId}`);
//     console.log(`User ${socket.data.userId} joined group ${groupId}`);
//   });

//   socket.on("leaveGroup", (groupId: string) => {
//     socket.leave(`group:${groupId}`);
//   });

//   socket.on("sendMessage", ({ groupId, message }) => {
//     const payload = {
//       ...message,
//       senderId: socket.data.userId,
//       groupId,
//       createdAt: new Date(),
//     };

//     io.to(`group:${groupId}`).emit("receiveMessage", payload);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Socket disconnected:", socket.data.userId);
//   });
// });

// /* ===============================
//    Start Socket Server
//    =============================== */
// httpServer.listen(SOCKET_PORT, () => {
//   console.log(`🔌 Socket server running on http://localhost:${SOCKET_PORT}`);
// });
