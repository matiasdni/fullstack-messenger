import { Message } from "../models/message";

export async function createMessage(
  content: string,
  userId: string,
  chatId: string
) {
  return await Message.create({ content, chat_id: chatId, user_id: userId });
}
