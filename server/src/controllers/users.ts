import { Request, Response } from "express";
import { createUser, getAllUsers, getUserById } from "../services/userService";
import authenticate, { AuthRequest } from "../middlewares/auth";
import { validateUserData } from "../middlewares/validationMiddleware";
import { Chat, Message, User } from "../models/initModels";
import { Op } from "sequelize";

const router = require("express").Router();

router.post(
  "/register",
  validateUserData,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    res.status(201).json(user);
  }
);

router.get("/", async (req: Request, res: Response) => {
  const users = await getAllUsers();
  res.status(200).json(users);
});

router.get("/:id", async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(user);
});

router.get(
  "/:id/chats",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const chats = await Chat.findAll({
      include: [
        {
          model: User,
          as: "users",
          where: { id: req.user.id },
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
        {
          model: Message,
          as: "messages",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["username"],
            },
          ],
        },
      ],
      where: {
        [Op.or]: [
          { chat_type: "group" },
          {
            chat_type: "private",
            "$messages.id$": { [Op.ne]: null },
          },
        ],
      },
    });

    res.json(chats);
  }
);

router.post(
  "/search",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const { name } = req.body;

    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${name}%`,
        },
        id: {
          [Op.ne]: req.user?.id,
        },
      },
      attributes: ["id", "username"],
      limit: 5,
    });

    res.status(200).json(users);
  }
);

router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  // implement again later
});

module.exports = router;
