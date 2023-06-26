import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/config";
import { User } from "../models";
import friendService from "../services/friendService";
import { getPendingInvites } from "../services/inviteService";
import { ApiError } from "../utils/ApiError";
import { jwtSign } from "../utils/jwt";
import logger from "../utils/logger";
import { AuthRequest } from "../middlewares/auth";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username,
    },
  });

  const isCorrectPassword = await user?.comparePassword(password);

  if (!isCorrectPassword || !user) {
    logger.error("invalid username or password on login");
    throw new ApiError(401 as const, "invalid credentials");
  }

  const token = await jwtSign(
    { username: user.username, id: user.id },
    jwtSecret,
    {
      expiresIn: "1d",
    }
  );
  const friends = await friendService.getFriends(user.id);
  const friendRequests = await friendService.getFriendRequests(user.id);
  const sentFriendRequests = await friendService.getSentFriendRequests(user.id);
  const chatInvites = await getPendingInvites({ userId: user.id });

  res.status(200).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      chatInvites,
      friends,
      friendRequests,
      sentFriendRequests,
    },
  });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user.id;
  if (!userId) {
    logger.error("no user in session");
    throw new ApiError(401 as const, "no session");
  }

  const user = await User.findByPk(userId);
  if (!user) {
    logger.error("no user found in db");
    throw new ApiError(401 as const, "no user found in db");
  }

  const token = jwt.sign({ ...user }, jwtSecret, { expiresIn: "1d" });
  const friends = await friendService.getFriends(user.id);
  const friendRequests = await friendService.getFriendRequests(user.id);
  const sentFriendRequests = await friendService.getSentFriendRequests(user.id);
  const chatInvites = await getPendingInvites({ userId: user.id });

  res.status(200).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      chatInvites,
      friends,
      friendRequests,
      sentFriendRequests,
    },
  });
};

export const logOut = async (req: Request, res: Response) => {
  res.status(200).json({ message: "logged out" });
};
