import { Request, Response } from "express";
import {
  createChatWithUsers,
  findOrCreatePrivateChat,
} from "../services/chatService";
import { Chat } from "../models/chat";
import { User } from "../models/user";
import { Message } from "../models/message";
import { io } from "../server";
import { sequelize } from "../models/initModels";

interface AuthenticatedRequest extends Request {
  user: User;
}

export enum ChatTypeEnum {
  group,
  private,
}

export type ChatType = keyof typeof ChatTypeEnum;

export interface ChatData {
  name: string;
  chat_type: ChatType;
  userIds: string[];
  description?: string;
  currentUser?: User;
}

export const createChat = async (req: AuthenticatedRequest, res: Response) => {
  const { name, description, chat_type, userIds } = req.body as ChatData;
  const currentUser: User = req.user;
  const transaction = await sequelize.transaction();

  let chat;

  if (chat_type === "private") {
    const user = await User.findByPk(currentUser.id, { transaction });
    const otherUser = await User.findByPk(userIds[0], { transaction });

    if (!user || !otherUser) {
      await transaction.rollback();
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    chat = await findOrCreatePrivateChat(user, otherUser, transaction);

    console.log("chat created", chat);

    await chat.addUsers([user, otherUser], transaction);

    console.log("chat users added", chat);

    //TODO: fix this
    await chat.reload({
      include: [
        {
          association: Chat.associations.users,
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
        {
          association: Chat.associations.messages,
          attributes: ["id", "content", "createdAt"],
          include: [
            {
              association: Message.associations.user,
              attributes: ["id", "username"],
            },
          ],
        },
      ],
      attributes: ["id", "name", "description", "chat_type"],
      transaction,
    });
  } else {
    chat = await createChatWithUsers(
      {
        name,
        description,
        chat_type,
        userIds,
        currentUser,
      },
      transaction
    );
  }

  await transaction.commit();

  res.status(200).json(chat);
  if (chat.chat_type === "group") {
    io.to(userIds).emit("invite", chat);
  } else {
    io.to(userIds).emit("join-room", chat.id);
  }
};

export const chatById = async (req: any, res: Response) => {
  const chat = await Chat.findByPk(req.params.id, {
    include: [
      {
        association: Chat.associations.users,
        attributes: ["id", "username"],
      },
      {
        association: Chat.associations.messages,
        attributes: ["id", "content", "createdAt"],
        include: [
          {
            association: Message.associations.user,
            attributes: ["id", "username"],
          },
        ],
      },
    ],
  });

  res.status(200).json(chat);
};
