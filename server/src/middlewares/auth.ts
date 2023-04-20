import { getUserByToken } from "../services/userService";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { Socket } from "socket.io";

export interface AuthRequest extends Request {
  user: User;
}

const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("no auth header");
    return res.status(401).send({ error: "unauthorized" });
  }

  const user = await getUserByToken(token);
  if (!user) {
    console.log("no user");
    res.status(401).send({ error: "unauthorized" });
  }

  if (user instanceof User) req.user = user;
  next();
};

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.auth.token;
  getUserByToken(token)
    .then((user) => {
      if (!token || !user) {
        return next(new Error("unauthorized"));
      }
      socket.data.user = user;
      next();
    })
    .catch((err) => {
      next(err);
    });
};

export default authenticate;
