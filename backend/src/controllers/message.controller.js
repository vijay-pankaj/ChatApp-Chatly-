// const { saveMessage } = require("../services/message.service");

// const handleMessage = async (data) => {
//   const message = await saveMessage(data);
//   return message;
// };


// module.exports = { handleMessage };

const messageService = require("../services/message.service");

// ✅ SOCKET HANDLER (for socket file)
const handleMessage = async (data) => {
  const message = await messageService.saveMessage(data);
  return message;
};

// ✅ API CONTROLLER (for REST)
const getChat = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const { userId } = req.params;

    const messages = await messageService.getChatBetweenUsers(
      loggedInUserId,
      userId
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  handleMessage,
  getChat,
};
