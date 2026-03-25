const { Server } = require("socket.io");
const chatHandler = require("../sockets/chat.socket");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    chatHandler(socket, io);
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = { initSocket, getIO };
