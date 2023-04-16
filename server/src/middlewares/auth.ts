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
    return res.status(401).send({ error: "unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).send({ error: "Invalid token." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: "Unable to authenticate user." });
  }
};

export default authenticate;
