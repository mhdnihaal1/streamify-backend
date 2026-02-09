import { Server } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("message", (data) => {
      io.emit("message", data);
    });
  });
};
