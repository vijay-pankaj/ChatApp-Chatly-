const repo = require("../repositories/message.repository");

// ✅ Save message (already correct)
const saveMessage = async (data) => {
  return await repo.createMessage(data);
};

// ✅ Get chat between users (NEW)
const getChatBetweenUsers = async (user1, user2) => {
  return await repo.getMessagesBetweenUsers(user1, user2);
};

module.exports = {
  saveMessage,
  getChatBetweenUsers,
};
