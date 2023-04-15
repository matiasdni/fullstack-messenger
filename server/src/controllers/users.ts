import { User } from "../db";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = require("express").Router();

router.get("/", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findOne({ where: { id: decodedToken.id } });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    } else {
      const users = await User.findAll();
      res.status(200).json(users);
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Not authorized" });
  }
});

router.post("/new", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log("username", username);
  console.log("password", password);

  const userExists: User | null = await User.findOne({
    where: { username },
  });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser: User | void = await User.create({
    username,
    password_hash: password,
  });

  res.status(201).json(newUser);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { username } = req.body;

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findOne({ where: { id: decodedToken.id } });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }
    if (user.username !== username) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await User.destroy({ where: { username } });
    res.status(204).json({ message: "User deleted" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Not authorized" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { id: string } = req.params;

  try {
    const id: number = parseInt(string);
    const user: User | null | void = await findUserByIdAndVerifyPassword(
      id,
      password
    ).catch((error: Error) => {
      res.status(400).json({ message: error.message });
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or invalid password" });
    }

    await User.update({ username }, { where: { id } });
    res.status(204).json({ message: "User updated" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

const findUserByIdAndVerifyPassword = async (
  id: number,
  password: string
): Promise<User | null> => {
  const user: User = <User>await User.findByPk(id);
  if (!user) throw new Error("Invalid id");

  const passwordIsValid: boolean = await user.comparePassword(password);
  if (!passwordIsValid) throw new Error("Invalid password");

  return user;
};

module.exports = router;
