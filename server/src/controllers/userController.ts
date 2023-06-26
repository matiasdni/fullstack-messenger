import { Request, Response } from "express";
import _ from "lodash";
import { AuthRequest } from "../middlewares/auth";
import { io } from "../server";
import { addUserToChat, findChats } from "../services/chatService";
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
import { Chat } from "../models";
import { where } from "sequelize";

export const newUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    logger.error("username or password missing");
    throw new ApiError(400, "username or password missing");
  }
  if (username.length < 3 || password.length < 3) {
    logger.error("username or password too short");
    throw new ApiError(400, "username or password too short");
  }
  if (username.length > 20 || password.length > 20) {
    logger.error("username or password too long");
    throw new ApiError(400, "username or password too long");
  }

  const user = await createUser(username, password);

  // find general chat and add user to it
  const chat = await Chat.findOne({
    where: {
      name: "General",
    },
  });

  const generalChat = await Chat.findByPk(chat?.id);
  if (!generalChat) {
    throw new ApiError(404, "General chat not found");
  }
  await addUserToChat(user, generalChat);

  res.status(201).json(user);
};

export const getAll = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  res.status(200).json(users);
};

export const getUser = async (req: AuthRequest, res: Response) => {
  const user = await getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(user);
};

export const getUserChats = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const chatIds = await getChatIds(user.id);
  const chats = await findChats(chatIds);
  res.json(chats);
};

export const getFriends = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const friends = await friendService.getFriends(user.id);
  res.json(friends);
};

export const getFriend = async (req: AuthRequest, res: Response) => {
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
};

export const sendFriendRequest = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  logger.info(`User ${user.id} sending friend request ${req.params.friendId}`);
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
};

export const acceptFriendRequest = async (req: AuthRequest, res: Response) => {
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

  io.to(otherUserId).emit("userUpdate", friend[otherUserId as any]);
};

export const rejectFriendRequest = async (req: AuthRequest, res: Response) => {
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
};

export const removeFriend = async (req: AuthRequest, res: Response) => {
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
};

export const getRequests = async (req: AuthRequest, res: Response) => {
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
};

export const searchUser = async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const users = await searchUsers(name, req.user);
  res.status(200).json(users.map((user) => user.toJSON()));
};

export const removeUser = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user || user.id !== req.params.id) {
    return res.status(403).json({ error: "Not Authorized" });
  }
  await friendService.removeUser(user.id);
  res.status(204).end();
};
