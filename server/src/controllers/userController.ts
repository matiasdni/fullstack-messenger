import { Request, Response } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  searchUsers,
} from "../services/userService";
import authenticate, { AuthRequest } from "../middlewares/auth";
import { validateUserData } from "../middlewares/validationMiddleware";
import { findChats } from "../services/chatService";
import { getChatIds } from "../services/userChatService";
import { getPendingInvites } from "../services/inviteService";

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
    const chatIds = await getChatIds(req.params.id);
    const chats = await findChats(chatIds);
    res.json(chats);
  }
);

router.get(
  "/:id/friends",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    res.json({ message: "Not implemented yet" });
  }
);

router.get(
  "/:id/requests",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    console.log("Getting requests");
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const requests = await getPendingInvites({ userId: user.id });

    res.json(requests);
  }
);

router.post(
  "/search",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const { name } = req.body;
    const users = await searchUsers(name, req);
    res.status(200).json(users);
  }
);

router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  // implement again later
});

export default router;
