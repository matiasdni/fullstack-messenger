import { UserChat } from "../models/userChat";

export const getChatIds = async (userId: string) => {
  return await UserChat.findAll({
    where: {
      user_id: userId,
    },
    attributes: ["chat_id"],
  });
};

export const chatUsers = async (chatId: string) => {
  return await UserChat.findAll({
    where: {
      chat_id: chatId,
    },
    attributes: ["user_id"],
  });
};
