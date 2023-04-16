import { Request, Response } from "express";
import { User } from "../models/user";
import { createUser, deleteUser } from "../services/userService";
import authenticate, { AuthRequest } from "../middlewares/auth";

const router = require("express").Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await createUser(username, password);
  res.status(201).json(user);
});

router.get("/", authenticate, async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.status(200).json(users);
});

router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (user && user.id === String(req.params.id)) {
    await deleteUser(user);
    res.status(204).json({ message: "User deleted" });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
