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
import friendService from "../services/friendService";

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

router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
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
    const user = req.user;
    const chatIds = await getChatIds(user.id);
    const chats = await findChats(chatIds);
    res.json(chats);
  }
);

router.get(
  "/:id/friends",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const friends = await friendService.getFriends(user.id);
    res.json(friends);
  }
);

router.get(
  "/:id/friends/:friendId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const user = req.user;
    if (!user || user.id !== req.params.friendId) {
      console.log("Not authorized");
      return res.status(403).json({ error: "Not Authorized" });
    }
    const friend = await friendService.getFriend(
      req.params.id,
      req.params.friendId
    );
    res.json(friend);
  }
);

router.put(
  "/:id/friends/:friendId/accept",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const user = req.user;
    if (!user || user.id !== req.params.friendId) {
      console.log("Not authorized");
      return res.status(403).json({ error: "Not Authorized" });
    }
    const friend = await friendService.acceptFriendRequest(
      req.params.friendId,
      req.params.id
    );
    console.log("friend request accepted", friend.toJSON());

    res.json(friend.toJSON());
  }
);

router.put(
  "/:id/friends/:friendId/reject",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const user = req.user;
    if (!user || user.id !== req.params.friendId) {
      console.log("Not authorized");
      return res.status(403).json({ error: "Not Authorized" });
    }
    const friend = await friendService.rejectFriendRequest(
      req.params.friendId,
      req.params.id
    );
    console.log("friend request rejected", friend.toJSON());

    res.json(friend.toJSON());
  }
);

router.delete(
  "/:id/friends/:friendId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const user = req.user;
    if (!user || user.id !== req.params.friendId) {
      console.log("Not authorized");
      return res.status(403).json({ error: "Not Authorized" });
    }
    const friend = await friendService.removeFriend(
      req.params.friendId,
      req.params.id
    );
    console.log("friend removed", friend.toJSON());

    res.status(204).json();
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

    const friendRequests = await friendService.getFriendRequests(user.id);

    const returnValues = {
      invites: requests,
      friendRequests,
    };
    console.log("return values", returnValues);

    res.json(returnValues);
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
