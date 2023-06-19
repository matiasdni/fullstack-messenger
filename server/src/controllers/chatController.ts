import { Request, Response } from "express";
import fs from "fs";
import { connectedClients } from "../listeners/socketHandler";
import { AuthRequest } from "../middlewares/auth";
import { Chat, Invite } from "../models";
import { Message } from "../models";
import { User } from "../models";
import { io } from "../server";
import {
  createChatWithUsers,
  findOrCreatePrivateChat,
} from "../services/chatService";
import { createMessage } from "../services/messageService";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";

interface AuthenticatedRequest extends Request {
  user:
    | Partial<User>
    | {
        username: string;
        id: string;
      };
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
  currentUser?: Partial<User>;
}

// todo: fix this spaghetti
const createChat = async (req: AuthenticatedRequest, res: Response) => {
  const { name, description, chat_type, userIds } = req.body as ChatData;
  const currentUser = req.user;

  let chat: Chat | null = null;

  if (chat_type === "private") {
    const user = await User.findByPk(currentUser.id);
    const filteredUserIds = userIds.filter((id) => id !== currentUser.id);
    const otherUser = await User.findByPk(filteredUserIds[0]);

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

  logger.info(chat.toJSON());

  res.status(200).json(chat.toJSON());

  const currentUserSockets = connectedClients[currentUser.id as string];
  currentUserSockets.forEach((socket) => {
    socket.join(chat?.id as string);
  });

  if (chat.chat_type === "group") {
    const invites = chat.invites;
    invites.forEach((invite: Invite) => {
      io.to(invite.recipientId).emit("chat-invite", {
        invite,
        chat: {
          id: chat?.id,
          name: chat?.name,
        },
        sender: {
          id: currentUser.id,
          username: currentUser.username,
        },
      });
    });
  }

  io.to(userIds).emit("join-room", chat.id);
};

const chatById = async (req: any, res: Response) => {
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

const sendMessage = async (req: AuthRequest, res: Response) => {
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

const removeUserFromChat = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const currentUser = req.user;
  const chat = await Chat.findByPk(req.params.chatId);
  if (!chat) throw new ApiError(404, "Chat not found");
  const user = await User.findByPk(req.params.userId);
  if (!user) throw new ApiError(404, "User not found");
  await chat.removeUser(user);

  const updatedChat = await Chat.findByPk(req.params.chatId, {
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

  // remove user from chat room
  const usersToRemove = connectedClients[user.id];
  if (usersToRemove) {
    usersToRemove.forEach((socket) => {
      socket.leave(req.params.chatId);
      socket.emit("leave-room", updatedChat?.id);
    });
  }

  res.status(200).json(updatedChat?.toJSON());

  io.to(req.params.chatId).emit("chatUpdate", updatedChat?.toJSON());
};

const updateChat = async (req: AuthRequest, res: Response) => {
  const { chatId } = req.params;
  const currentUser = req.user;

  const chat = await Chat.findByPk(chatId);
  if (!chat) throw new ApiError(404, "Chat not found");

  if (chat.ownerId !== currentUser.id)
    throw new ApiError(403, "You do not have permission to update this chat");

  let chatUpdateData: Partial<Chat> = {
    name: req.body.name,
    description: req.body.description,
    image: req.file?.path,
  };

  if (chatUpdateData.image) {
    // delete old image
    if (chat.image) {
      fs.unlink(chat.image, (err) => {
        if (err) throw err;
        logger.info("Old image deleted");
      });
    }
  }

  logger.info(chatUpdateData);

  const affectedRows = await Chat.update(chatUpdateData, {
    where: {
      id: chatId,
    },
    returning: true,
  });

  const updatedChat = affectedRows[1][0];

  logger.info(affectedRows);
  logger.info(await affectedRows[1][0].getUsers());

  res.json(updatedChat);

  io.to(chatId).emit("chatUpdate", updatedChat.toJSON());
};

export default {
  createChat,
  chatById,
  sendMessage,
  removeUserFromChat,
  updateChat,
};
