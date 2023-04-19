import { getUserByToken } from "../services/userService";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";

export interface AuthRequest extends Request {
  user: User;
}

const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    console.log("no auth header");
    return res.status(401).send({ error: "unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const user = await getUserByToken(token);
    if (!user) {
      console.log("no user");
      return res.status(401).send({ error: "Invalid token." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: "Unable to authenticate user." });
  }
};

export const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return next(new Error("Authentication error"));
    }
    socket.data.user = user;
    next();
  } catch (error) {
    console.error(error);
    return next(new Error("Authentication error"));
  }
};

export default authenticate;
