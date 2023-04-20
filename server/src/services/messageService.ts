import { Chat } from "../models/chat";
import { Message } from "../models/message";

export async function createMessage(
  content: string,
  userId: string,
  chatId: string
) {
  return await Message.create({ content, chat_id: chatId, user_id: userId });
}

export async function getMessages(chat: Chat) {
  return await chat.getMessages();
}
