import _ from "lodash";
import { Op, Transaction } from "sequelize";
import { ChatData } from "../controllers/chatController";

import { Chat, Invite, User } from "../models";

export const addUserToChat = async (user: User, chat: Chat) => {
  await chat.addUser(user);
};

export async function findChats(ids: string[]): Promise<Chat[]> {
  const chats = await Chat.findAll({
    where: {
      id: ids,
    },
    include: [
      {
        association: "users",
        attributes: ["id", "username"],
        as: "users",
        through: { attributes: [] },
      },
      {
        association: "messages",
        attributes: ["id", "content", "createdAt", "updatedAt"],
        order: [["createdAt", "ASC"]],
        separate: true,
        include: [
          {
            association: "user",
            attributes: ["id", "username"],
            as: "user",
          },
        ],
      },
    ],
  });

  return _.orderBy(
    chats,
    [
      (chat) => {
        if (chat.messages.length === 0) {
          return chat.createdAt;
        }
        return chat.messages[chat.messages.length - 1].createdAt;
      },
    ],
    ["desc"]
  );
}

export async function createChat(
  name: string,
  description?: string,
  chat_type?: string,
  ownerId?: string
) {
  return await Chat.create({ name, description, chat_type, ownerId });
}

export const createChatWithUsers = async (
  chatData: ChatData,
  transaction?: Transaction
): Promise<Chat> => {
  // create chat
  const chat = await Chat.create(
    {
      name: chatData.name,
      description: chatData.description,
      chat_type: chatData.chat_type,
      ownerId: chatData.currentUser?.id,
    },
    { transaction }
  );
  // create invitations
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

  // add invitations to chat
  await chat.addInvites(invitations, { transaction });
  const user = await User.findByPk(chatData.currentUser!.id, {
    transaction,
  });
  // add current user to chat (owner / creator)
  await chat.addUser(user!, { transaction });

  await chat.reload({
    include: [
      {
        association: "owner",
        attributes: ["id", "username"],
      },
      {
        association: "users",
        attributes: ["id", "username"],
      },
      {
        association: "messages",
        include: [
          {
            association: "user",
            attributes: ["id", "username"],
          },
        ],
      },
      {
        association: "invites",
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

module.exports = {
  addUserToChat,
  findChats,
  createChat,
  createChatWithUsers,
  findOrCreatePrivateChat,
};
