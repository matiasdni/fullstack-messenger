import { Chat, UserChat } from "../models/initModels";
import { Message } from "../models/message";

export async function createMessage(
  content: string,
  userId: string,
  chatId: string
) {
  const chat = await Chat.findByPk(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  const chatUser = await UserChat.findOne({
    where: {
      chat_id: chatId,
      user_id: userId,
    },
  });

  if (!chatUser) {
    throw new Error("User not in chat");
  }

  const message = await Message.create({
    content,
    chat_id: chatId,
    user_id: userId,
  });

  return await message
    .reload({
      include: [
        {
          association: "user",
          attributes: ["id", "username"],
        },
      ],
    })
    .then((message) => message.toJSON());
}
