import { User } from "../db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const router = require("express").Router();

router.get("/", async (req: Request, res: Response) => {
  const users: User[] = await User.findAll();
  res.json(users);
});

router.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(username, password);
  const saltRounds: number = 10;

  const hashedPassword: string = await bcrypt.hash(password, saltRounds);

  const newUser: User | void = await User.create({
    username,
    password_hash: hashedPassword,
  }).catch((error: Error) => {
    res.status(400).json({ message: error.message });
    console.log(error);
  });
  res.status(201).json(newUser);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { password } = req.body;
  const { id: string } = req.params;

  try {
    const id: number = parseInt(string);
    const user: any = await findUserByIdAndVerifyPassword(id, password);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or invalid password" });
    }

    await User.destroy({ where: { id } });
    res.status(204).json({ message: "User deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
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
