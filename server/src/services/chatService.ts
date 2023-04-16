import { Chat } from "../models/chat";
import { User } from "../models/user";

export const GENERAL_CHAT_ID = "your-unique-general-chat-id";

export const findOrCreateGeneralChat = async (): Promise<Chat> => {
  const generalChat = await Chat.findOrCreate({
    where: { id: GENERAL_CHAT_ID },
    defaults: {
      id: GENERAL_CHAT_ID,
      name: "general",
      description: "A general chat room for all users",
    },
  });

  return generalChat[0];
};

export async function addUserToChat(user: User, chat: Chat) {
  await chat.addUser(user);
}

export async function createChat(name: string, description?: string) {
  return await Chat.create({ name, description });
}

export async function getChatById(id: string) {
  return await Chat.findByPk(id);
}

export async function getChats(user: User) {
  return await user.getChats();
}

export async function getUsers(chat: Chat) {
  return await chat.getUsers();
}