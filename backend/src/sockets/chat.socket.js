const { saveMessage } = require("../services/message.service");

const users = new Map();

module.exports = (socket, io) => {

  console.log("User connected:", socket.id);

  // ✅ REGISTER USER
  socket.on("register", (userId) => {
    users.set(String(userId), socket.id);
    console.log("Users Map:", users);
  });

  // ✅ PRIVATE MESSAGE
  socket.on("private_message", async ({ to, message, from }) => {
    console.log("Sending from:", from, "to:", to);

    // save in DB
    const savedMessage = await saveMessage({
      senderId: from,
      receiverId: to,
      message,
    });

    // find receiver socket
    const receiverSocket = users.get(String(to));

    console.log("Receiver socket:", receiverSocket);

    // send to receiver
    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_private_message", savedMessage);
    }

    // send back to sender
    socket.emit("receive_private_message", savedMessage);
  });

  // ❌ DISCONNECT
  socket.on("disconnect", () => {
    for (let [userId, sockId] of users.entries()) {
      if (sockId === socket.id) {
        users.delete(userId);
      }
    }
    console.log("Users after disconnect:", users);
  });
};
