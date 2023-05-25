import { Request, Response } from "express";
import { createChatWithUsers } from "../services/chatService";
import { Chat } from "../models/chat";
import { User } from "../models/user";
import authenticate from "../middlewares/auth";
import { Message } from "../models/message";
import { io } from "../server";

const router = require("express").Router();

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
}

const validateChatData = async (req: Request, res: Response, next: any) => {
  const { chat_type, userIds } = req.body as ChatData;

  if (chat_type !== "private") {
    next();
  } else if (userIds.length !== 2) {
    res.status(400).json({ error: "private chat must have 2 users" });
  } else {
    next();
  }

  const existingChat = await Chat.findOne({
    where: { chat_type },
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id"],
        through: { attributes: [] },
        where: { id: userIds },
      },
    ],
  });

  if (existingChat) {
    res.status(200).json(existingChat);
  }

  next();
};

router.use(authenticate);

router.post("/", validateChatData, async (req: any, res: Response) => {
  const { name, description, chat_type, userIds } = req.body as ChatData;
  userIds.unshift(req.user.id);

  const chat = await createChatWithUsers({
    name,
    description,
    chat_type,
    userIds,
  });

  console.log("chat created", chat);

  res.status(200).json(chat);

  const currentUser = req.user;
  const otherUserId = userIds.find((id: string) => id !== currentUser.id);
  const otherUser = await User.findOne({
    where: { id: otherUserId },
  });

  io.to(currentUser.id).emit("join-room", chat.id);
  io.to(otherUser?.id).emit("join-room", chat.id);
});

router.get("/:id", async (req: any, res: Response) => {
  try {
    const chat = await Chat.findByPk(req.params.id, {
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
          attributes: ["id", "content", "createdAt"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username"],
            },
          ],
        },
      ],
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
