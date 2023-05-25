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
  currentUser?: User;
}

router.use(authenticate);

router.post("/", async (req: any, res: Response) => {
  const { name, description, chat_type, userIds } = req.body as ChatData;
  const currentUser: User = req.user;

  let chat;

  if (chat_type === "private") {
    // handle private chat create
  } else {
    chat = await createChatWithUsers({
      name,
      description,
      chat_type,
      userIds,
      currentUser,
    });
  }

  console.log("chat created", chat);

  res.status(200).json(chat);

  io.to(userIds).emit("invite", chat);
});

router.get("/:id", async (req: any, res: Response) => {
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
});

module.exports = router;
