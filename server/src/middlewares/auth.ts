import { NextFunction, Request, Response } from "express";
import { mySocket } from "../listeners/types";
import { User } from "../models/user";
import { getUserByToken } from "../services/userService";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";

export interface AuthRequest extends Request {
  user: User;
}

const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // try to authenticate with token
  const token = req.headers.authorization?.split(" ")[1] || "";
  const user = await getUserByToken(token);
  if (!user || !token) {
    throw new ApiError(401 as const, "unauthorized");
  }
  req.user = user;
  next();
};

export const authenticateSocket = async (
  socket: mySocket,
  next: (err?: Error | undefined) => void
) => {
  const token = socket.handshake.auth.token;
  try {
    const user = await getUserByToken(token);
    if (!token || !user) {
      logger.error("failed to authenticate in middleware");
      return next(new Error("unauthorized"));
    }
    socket.user = user;
    next();
  } catch (error) {
    next(new Error("unauthorized"));
  }
};

export default authenticate;
