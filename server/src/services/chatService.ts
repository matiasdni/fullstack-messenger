import _ from "lodash";
import { Op, Transaction } from "sequelize";
import { ChatData } from "../controllers/chatController";
import { Invite } from "../models/Invite";
import { Chat } from "../models/chat";
import { User } from "../models/user";

export async function addUserToChat(user: User, chat: Chat) {
  await chat.addUser(user);
}

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

  const sortedChats = _.orderBy(
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

  return sortedChats;
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
  // create chat
  const chat = await Chat.create(
    {
      name: chatData.name,
      description: chatData.description,
      chat_type: chatData.chat_type,
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
  // add current user to chat (owner / creator)
  await chat.addUser(chatData.currentUser!, { transaction });

  await chat.reload({
    include: [
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
