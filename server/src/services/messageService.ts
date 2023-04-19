import { User } from "../models/user";
import { Chat } from "../models/chat";
import { Message } from "../models/message";

export async function createMessage(content, userId, chatId) {
  return await Message.create({ content, chat_id: chatId, user_id: userId });
}

export async function getMessages(chat: Chat) {
  return await chat.getMessages();
}
