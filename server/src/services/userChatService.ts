import { UserChat } from "../models";

export const getChatIds = async (userId: string) => {
  const chat_ids = await UserChat.findAll({
    where: {
      user_id: userId,
    },
    attributes: ["chat_id"],
  });

  return chat_ids.map((chat: UserChat) => chat.chat_id) as string[];
};
