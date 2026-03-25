// const Message = require("../models/message.model");

// const createMessage = async (data) => {
//   return await Message.create(data);
// };

// const getMessagesBetweenUsers = async (user1, user2) => {
//   return await Message.findAll({
//     where: {
//       senderId: [user1, user2],
//       receiverId: [user1, user2],
//     },
//     order: [["createdAt", "ASC"]],
//   });
// };

// module.exports = {
//   createMessage,
//   getMessagesBetweenUsers,
// };
const Message = require("../models/message.model");
const { Op } = require("sequelize");

const createMessage = async (data) => {
  return await Message.create(data);
};

const getMessagesBetweenUsers = async (user1, user2) => {
  return await Message.findAll({
    where: {
      [Op.or]: [
        {
          senderId: user1,
          receiverId: user2,
        },
        {
          senderId: user2,
          receiverId: user1,
        },
      ],
    },
    order: [["createdAt", "ASC"]],
  });
};

module.exports = {
  createMessage,
  getMessagesBetweenUsers,
};
