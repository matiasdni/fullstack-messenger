import { Response } from "express";
import authenticate, { AuthRequest } from "../middlewares/auth";
import { User } from "../models/user";
import { Chat } from "../models/chat";
import { Message } from "../models/message";

const router = require("express").Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const userModelInstance = await User.findByPk(user.id, {
    include: [
      {
        model: Chat,
        as: "chats",
        through: { attributes: [] },
        attributes: ["id", "name", "description", "updatedAt"],
        order: [["updatedAt", "DESC"]],
        include: [
          {
            model: Message,
            as: "messages",
            attributes: ["id", "content", "createdAt"],
            order: [["createdAt", "ASC"]],
            include: [
              {
                model: User,
                as: "user",
                attributes: ["username"],
              },
            ],
          },
          {
            model: User,
            as: "users",
            through: { attributes: [] },
            attributes: ["id", "username"],
          },
        ],
      },
    ],
  });
  console.log(userModelInstance);
  if (user) {
    const returnedUser: any = await user.getChats();
    console.log(returnedUser);
    const chats = returnedUser.chats;
    res.send(userModelInstance?.chats).status(200);
  }
});

module.exports = router;
