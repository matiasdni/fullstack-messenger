import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";

export const getUserByToken = async (token: string): Promise<User | null> => {
  try {
    const decoded = jwt.verify(token, jwtSecret) as User;
    return await User.findByPk(decoded.dataValues.id);
  } catch (error) {
    console.error(error);
    return null;
  }
};

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
  return await User.findAll({
    attributes: { exclude: ["password"] },
    order: [["username", "ASC"]],
  });
}

export async function updateUser(
  id: string,
  username: string,
  password: string
) {
  const user = await User.findByPk(id);
  if (user) {
    user.username = username;
    user.password = password;
    return await user.save();
  }
}

export async function deleteUser(user: User) {
  await user.destroy();
}

export async function deleteUserById(id: string) {
  const user = await User.findByPk(id);
  if (user) {
    await user.destroy();
  }
  return user;
}
