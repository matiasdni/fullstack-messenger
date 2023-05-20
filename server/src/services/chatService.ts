import { Chat } from "../models/chat";
import { User } from "../models/user";
import { Message } from "../models/message";

export async function addUserToChat(user: User, chat: Chat) {
  await chat.addUser(user);
}

export async function createChat(
  name: string,
  description?: string,
  chat_type?: string
) {
  return await Chat.create({ name, description, chat_type });
}

export const createChatWithUsers = async (chatData: any) => {
  const chat = await Chat.create(chatData);
  await chat.addUsers(chatData.users);
  await chat.reload({
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "username"],
        through: { attributes: [] },
      },
      {
        model: Message,
        as: "messages",
        attributes: ["id", "content", "createdAt", "updatedAt"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username"],
          },
        ],
      },
    ],
  });
  return chat;
};

export async function getChatById(id: string) {
  return await Chat.findByPk(id);
}
