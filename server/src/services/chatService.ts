import { Chat } from "../models/chat";
import { User } from "../models/user";
import { Message } from "../models/message";
import { UserChat } from "../models/userChat";
import { ChatData } from "../controllers/chatController";
import { Invite } from "../models/Invite";
import { Op } from "sequelize";
import { Transaction } from "sequelize";

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
        order: [["createdAt", "ASC"]],
        separate: true,
        include: [
          {
            model: User,
            attributes: ["id", "username"],
            as: "user",
          },
        ],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
}

export async function createChat(
  name: string,
  description?: string,
  chat_type?: string,
  owner_id?: string
) {
  return await Chat.create({ name, description, chat_type, owner_id });
}

export const createChatWithUsers = async (
  chatData: ChatData,
  transaction?: Transaction
): Promise<Chat> => {
  const chat = await Chat.create(
    {
      name: chatData.name,
      description: chatData.description,
      chat_type: chatData.chat_type,
    },
    { transaction }
  );

  const invitations: Invite[] = await Promise.all(
    chatData.userIds.map((userId) =>
      Invite.create(
        {
          chatId: chat.id,
          senderId: chatData.currentUser!.id,
          recipientId: userId,
        },
        { transaction }
      )
    )
  );

  await chat.addInvites(invitations, { transaction });

  await chat.addUser(chatData.currentUser!, { transaction });

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
      {
        association: "invites",
        attributes: ["sender_id", "recipient_id", "chat_id"],
      },
    ],
    transaction,
  });

  return chat;
};

export const findOrCreatePrivateChat = async (
  currentUser: User,
  otherUser: User
): Promise<Chat> => {
  const [chat, created] = await Chat.findOrCreate({
    where: {
      [Op.and]: {
        [Op.or]: [
          {
            name: `${currentUser.username} & ${otherUser.username}`,
          },
          {
            name: `${otherUser.username} & ${currentUser.username}`,
          },
        ],
        chat_type: "private",
      },
    },
    defaults: {
      name: `${currentUser.username} & ${otherUser.username}`,
      description: undefined,
      chat_type: "private",
    },
  });

  return chat;
};
