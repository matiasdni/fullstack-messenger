import { Chat } from "../models/chat";
import { User } from "../models/user";
import { Message } from "../models/message";
import { UserChat } from "../models/userChat";
import { ChatData } from "../controllers/chatController";

interface UserData {
  id: string;
  username: string;
}

export async function addUserToChat(user: User, chat: Chat) {
  await chat.addUser(user);
}

export async function findChats(ids: UserChat[]) {
  return await Chat.findAll({
    where: {
      id: ids.map((chat: any) => chat.chat_id),
    },
    include: [
      {
        model: User,
        attributes: ["id", "username"],
        as: "users",
        through: {
          attributes: [],
        },
      },
      {
        model: Message,
        as: "messages",
        attributes: ["id", "content", "createdAt", "updatedAt"],
        include: [
          {
            model: User,
            attributes: ["id", "username"],
            as: "user",
          },
        ],
      },
    ],
  });
}

export async function createChat(
  name: string,
  description?: string,
  chat_type?: string
) {
  return await Chat.create({ name, description, chat_type });
}

export const createChatWithUsers = async (
  chatData: ChatData
): Promise<Chat> => {
  const chat = await Chat.create({
    name: chatData.name,
    description: chatData.description,
    chat_type: chatData.chat_type,
    owner_id: chatData.userIds[0],
  });

  await chat.addUsers(chatData.userIds);
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
