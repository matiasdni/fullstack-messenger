import { UserChat } from "../models/userChat";

export const getChatIds = async (userId: string) => {
  const chat_ids = await UserChat.findAll({
    where: {
      user_id: userId,
    },
    attributes: ["chat_id"],
  });

  return chat_ids.map((chat) => chat.chat_id) as string[];
};

export const chatUsers = async (chatId: string) => {
  return await UserChat.findAll({
    where: {
      chat_id: chatId,
    },
    attributes: ["user_id"],
  });
};
