import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { Chat } from "../models/chat";
import { Message } from "../models/message";
import { User } from "../models/user";
import { io } from "../server";
import {
  createChatWithUsers,
  findOrCreatePrivateChat,
} from "../services/chatService";
import { createMessage } from "../services/messageService";
import { ApiError } from "../utils/ApiError";

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

// todo: fix this spaghetti
export const createChat = async (req: AuthenticatedRequest, res: Response) => {
  const { name, description, chat_type, userIds } = req.body as ChatData;
  const currentUser: User = req.user;

  let chat: Chat;

  if (chat_type === "private") {
    const user = await User.findByPk(currentUser.id);
    const otherUser = await User.findByPk(userIds[0]);

    if (!user || !otherUser) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    chat = await findOrCreatePrivateChat(user, otherUser);

    await chat.addUsers([user, otherUser]);

    //TODO: fix this
    await chat.reload({
      include: [
        {
          association: "users",
          attributes: ["id", "username"],
        },
        {
          association: "messages",
          attributes: ["id", "content", "createdAt"],
          include: [
            {
              association: "user",
              attributes: ["id", "username"],
            },
          ],
        },
      ],
      attributes: ["id", "name", "description", "chat_type"],
    });
  } else {
    chat = await createChatWithUsers({
      name,
      description,
      chat_type,
      userIds,
      currentUser,
    });
  }

  res.status(200).json(chat.toJSON());

  if (chat.chat_type === "group") {
    const invites = chat.invites;
    invites.forEach((invite) => {
      io.to(invite.recipientId).emit("chat-invite", {
        invite,
        chat: {
          id: chat.id,
          name: chat.name,
        },
        sender: {
          id: currentUser.id,
          username: currentUser.username,
        },
      });
    });
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

export const sendMessage = async (req: AuthRequest, res: Response) => {
  const { message } = req.body;
  const { id: chatId } = req.params;
  const user = req.user;

  console.log("chatId", chatId);

  const chat = await Chat.findByPk(chatId);

  if (!chat) throw new ApiError(404, "Chat not found");

  const newMessage = await createMessage(message, user.id, chatId);

  res.status(200).json(newMessage);
  io.to(chatId).emit("message", newMessage);
};
