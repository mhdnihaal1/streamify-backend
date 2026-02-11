import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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
  socket.on("joinGroup", (groupId: string) => {
    socket.join(`group:${groupId}`);
    console.log(`User ${socket.data.userId} joined group ${groupId}`);
  });

  /* Leave Group */
  socket.on("leaveGroup", (groupId: string) => {
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


















