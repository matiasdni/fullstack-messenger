import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    username: user.username,
  };

  return jwt.sign(payload, jwtSecret, { expiresIn: "1d" });
};

export const getUserByToken = async (token: string): Promise<User | null> => {
  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      username: string;
    };
    return await User.findByPk(decoded.id);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export async function createUser(username: string, password: string) {
  return await User.create({ username, password });
}

export async function authenticateUser(username: string, password: string) {
  const user = await User.findOne({ where: { username } });
  return user && (await user.comparePassword(password)) ? user : null;
}

export async function getUserById(id: string) {
  return await User.findByPk(id);
}

export async function getUserByUsername(username: string) {
  return await User.findOne({ where: { username } });
}

export async function getUsers() {
  return await User.findAll();
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
    await user.save();
  }
  return user;
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
