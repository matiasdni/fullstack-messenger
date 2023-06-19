import express, { NextFunction, Request, Response } from "express";
import { SessionData } from "express-session";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";
import { User } from "../models/user";
import friendService from "../services/friendService";
import { getPendingInvites } from "../services/inviteService";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";

declare module "express-session" {
  interface SessionData {
    user: string;
  }
}

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
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

  const token = jwt.sign({ ...user }, jwtSecret, { expiresIn: "1d" });
  const friends = await friendService.getFriends(user.id);
  const friendRequests = await friendService.getFriendRequests(user.id);
  const sentFriendRequests = await friendService.getSentFriendRequests(user.id);
  const chatInvites = await getPendingInvites({ userId: user.id });

  req.session.regenerate((err) => {
    if (err) next(err);
    req.session.user = user.id;

    req.session.save((err) => {
      if (err) next(err);
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
    });
  });
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.user;
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
});

router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  req.session.user = undefined;
  req.session.save(function (err) {
    if (err) next(err);
    req.session.regenerate(function (err) {
      if (err) next(err);
    });
    res.status(200).json({ message: "logged out" });
  });
});

export default router;
