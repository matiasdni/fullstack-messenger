import { User } from "../models/user";
import { Chat } from "../models/chat";
import { Message } from "../models/message";

export async function createMessage(content: string, user: User, chat: Chat) {
  return await Message.create({ content, chat_id: chat.id, user_id: user.id });
}

export async function getMessages(chat: Chat) {
  return await chat.getMessages();
}