import { Request, Response } from "express";
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

const validateChatData = async (
  req: Request,
  res: Response,
  next: any
): Promise<void> => {
  const { chat_type, userIds } = req.body as ChatData;
  if (chat_type !== "private") {
    next();
  } else {
    // check if private chat with these users id already exists
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
  }
};

router.post(
  "/",
  authenticate,
  validateChatData,
  async (req: any, res: Response) => {
    try {
      const { name, description, chat_type, userIds } = req.body as ChatData;

      const chat = await Chat.create({
        name: name,
        description: description,
        chat_type: chat_type,
      });

      res.status(200).json(chat);

      const currentUser = req.user;
      const otherUserId = userIds.filter((id: string) => id !== currentUser.id);
      const otherUser = await User.findOne({
        where: { id: otherUserId },
      });

      io.to(currentUser.id).emit("join-room", chat.id);
      io.to(otherUser?.id).emit("join-room", chat.id);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

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
