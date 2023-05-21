import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";
import { Op } from "sequelize";
import { getChatIds } from "./userChatService";
import { Chat } from "../models/chat";
import { Request as ExpressRequest } from "express";

interface Request extends ExpressRequest {
  user?: User;
}

export const getUserByToken = async (token: string): Promise<User | null> => {
  try {
    const decoded = jwt.verify(token, jwtSecret) as User;
    return await User.findByPk(decoded.dataValues.id);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export async function userChats(userId: string) {
  return await Chat.findAll({
    where: {
      id: {
        [Op.in]: await getChatIds(userId),
      },
    },
    attributes: ["id", "name", "description", "chat_type"],
  });
}

export async function createUser(username: string, password: string) {
  return await User.create({ username, password });
}

export async function getUserById(id: string) {
  return await User.findByPk(id, { attributes: { exclude: ["password"] } });
}

export async function getUserByUsername(username: string) {
  return await User.findOne({ where: { username } });
}

export async function getAllUsers() {
  return await User.findAll();
}

export async function searchUsers(
  username: string,
  req: Request
): Promise<User[]> {
  if (!username) {
    throw new Error("Username is required");
  }

  // Check if user is authenticated
  if (!req.user) {
    throw new Error("User is not authenticated");
  }

  return await User.findAll({
    where: {
      username: {
        [Op.iLike]: `%${username}%`,
      },
      id: {
        [Op.ne]: req.user?.id,
      },
    },
    attributes: ["id", "username"],
    limit: 5,
  });
}
