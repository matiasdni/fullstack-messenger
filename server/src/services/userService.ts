import { Op } from "sequelize";
import { jwtSecret } from "../config";
import { Chat, User } from "../models";
import { ApiError } from "../utils/ApiError";
import { jwtVerify } from "../utils/jwt";
import { getChatIds } from "./userChatService";

export const getUserByToken = async (token: string): Promise<User | null> => {
  try {
    const decoded = (await jwtVerify(token, jwtSecret)) as Partial<User>;
    return await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          association: "chats",
          attributes: ["id"],
          include: [
            {
              association: "users",
              attributes: ["id"],
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error(error);
    throw new ApiError(401 as const, "failed to authenticate");
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
  user: User
): Promise<User[]> {
  return await User.findAll({
    where: {
      username: {
        [Op.iLike]: `%${username}%`,
      },
      id: {
        [Op.ne]: user?.id,
      },
    },
    attributes: ["id", "username"],
    limit: 5,
  });
}
