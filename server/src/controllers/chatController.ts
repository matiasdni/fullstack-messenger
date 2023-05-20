import { Request, Response } from "express";
import { createChatWithUsers } from "../services/chatService";
import { Chat } from "../models/chat";
import { User } from "../models/user";
import authenticate from "../middlewares/auth";
import { io } from "../server";
import { Message } from "../models/message";

const router = require("express").Router();

const validateChatData = async (req: Request, res: Response, next: any) => {
  const { name, description, chat_type, users } = req.body;
  if (chat_type === "private") {
    // check if private chat with these users id already exists
    const existingChat = await Chat.findOne({
      where: { chat_type },
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id"],
          through: { attributes: [] },
          where: { id: users },
        },
      ],
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }
  }
  next();
};

router.post(
  "/",
  authenticate,
  validateChatData,
  async (req: any, res: Response) => {
    try {
      const { name, description, chat_type, users } = req.body;
      const chat = await createChatWithUsers({
        name,
        description,
        chat_type,
        users,
      });
      console.log("chat created", chat);
      res.status(200).json(chat);

      const currentUser = req.user;
      const otherUserId = users.filter((id: number) => id !== currentUser.id);
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
