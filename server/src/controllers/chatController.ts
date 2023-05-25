import { Request, Response } from "express";
import { createChatWithUsers } from "../services/chatService";
import { Chat } from "../models/chat";
import { User } from "../models/user";
import authenticate from "../middlewares/auth";
import { Message } from "../models/message";
import { io } from "../server";
import { Op } from "sequelize";

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

interface AuthenticatedRequest extends Request {
  user: User;
}

router.use(authenticate);

router.post("/", async (req: AuthenticatedRequest, res: Response) => {
  const { name, description, chat_type, userIds } = req.body as ChatData;
  const currentUser: User = req.user;

  let chat;

  if (chat_type === "private") {
    // handle private chat create
    const user = await User.findByPk(currentUser.id);
    const otherUser = await User.findByPk(userIds[0]);

    if (!user || !otherUser) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    chat = await Chat.findOrCreate({
      where: {
        [Op.and]: [
          { chat_type },
          {
            [Op.or]: [
              {
                name: `${user.username} & ${otherUser.username}`,
              },
              {
                name: `${otherUser.username} & ${user.username}`,
              },
            ],
          },
        ],
      },
      defaults: {
        name: `${user.username} & ${otherUser.username}`,
        description,
        chat_type,
      },
    });

    await chat[0].addUsers([user, otherUser]);

    await chat[0].reload({
      include: [
        {
          association: Chat.associations.users,
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
        // Include the messages
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
    // Include the users
    include: [
      {
        association: Chat.associations.users,
        attributes: ["id", "username"],
        through: { attributes: [] },
      },
      // Include the messages
      {
        association: Chat.associations.messages,
        attributes: ["id", "content", "createdAt"],
        include: [
          {
            association: Message.associations.user,
            attributes: ["id", "username"],
            through: { attributes: [] },
          },
        ],
      },
    ],
  });

  // Send the chat
  res.status(200).json(chat);
});

export default router;
