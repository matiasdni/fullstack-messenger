import { Request, Response } from "express";
import _ from "lodash";
import authenticate, { AuthRequest } from "../middlewares/auth";
import { validateUserData } from "../middlewares/validationMiddleware";
import { io } from "../server";
import { findChats } from "../services/chatService";
import friendService from "../services/friendService";
import { getPendingInvites } from "../services/inviteService";
import { getChatIds } from "../services/userChatService";
import {
  createUser,
  getAllUsers,
  getUserById,
  searchUsers,
} from "../services/userService";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";

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

router.post(
  "/:id/friends/:friendId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const user = req.user;
    logger.info(
      `User ${user.id} sending friend request ${req.params.friendId}`
    );
    if (!user || user.id !== req.params.id) {
      console.log("Not authorized");
      throw new ApiError(403, "Not Authorized");
    }
    const friend = await friendService.sendFriendRequest(
      req.params.id,
      req.params.friendId
    );

    res.json(friend);
    logger.info(`Friend request sent to ${JSON.stringify(friend)}`);
    io.to(friend.friendId).emit("friend-request", friend);
  }
);

router.put(
  "/:senderId/friends/:receiverId/accept",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const user = req.user;
    if (!user || user.id !== req.params.receiverId) {
      throw new ApiError(403, "Not Authorized to accept this request");
    }
    const friend = await friendService.acceptFriendRequest(
      req.params.receiverId,
      req.params.senderId
    );
    logger.info(`Friend request accepted ${JSON.stringify(friend)}`);

    res.json(friend[user.id]);
    const otherUserId = _.keys(friend).filter((key) => key !== user.id);

    // todo: send notification to friend
    io.to(otherUserId).emit("userUpdate", friend[otherUserId as any]);
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
    if (!user || user.id !== req.params.id) {
      throw new ApiError(403, "Not Authorized");
    }
    const updatedFriends = await friendService.removeFriend(
      req.params.id,
      req.params.friendId
    );
    console.log(updatedFriends);

    res.json({
      friends: updatedFriends[user.id],
    });

    io.to(req.params.friendId).emit("userUpdate", {
      friends: updatedFriends[req.params.friendId],
    });
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
    const users = await searchUsers(name);

    // filter out the current user
    const filteredUsers = users.filter((user) => user.id !== req.user.id);
    res.status(200).json(filteredUsers.map((user) => user.toJSON()));
  }
);

router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  // implement again later
});

export default router;
