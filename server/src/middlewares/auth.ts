import { NextFunction, Request, Response } from "express";
import { mySocket } from "../listeners/types";
import { getUserByToken } from "../services/userService";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";
import { User } from "../models/user";

export interface AuthRequest extends Request {
  user: User;
}

const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.header("Authorization")) {
    logger.error("header missing token");
    throw new ApiError(401 as const, "header missing");
  }
  const token = req.header("Authorization")!.replace("Bearer ", "");

  if (!token || token === "") {
    logger.error("header missing token");
    throw new ApiError(401 as const, "header missing token");
  }

  const user = await getUserByToken(token);
  if (!user) {
    logger.error("failed to authenticate in middleware");
    throw new ApiError(401 as const, "invalid credentials");
  }

  req.user = user;
  next();
};

export const authenticateSocket = async (
  socket: mySocket,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.auth.token;
  getUserByToken(token)
    .then((user: any) => {
      if (!token || !user) {
        logger.error("failed to authenticate in middleware");
        return next(new Error("unauthorized"));
      }
      socket.user = user;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

export default authenticate;
