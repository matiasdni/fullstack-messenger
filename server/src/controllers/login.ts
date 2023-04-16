import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { jwtSecret } from "../config";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordCorrect = await user.comparePassword(password);
  if (!passwordCorrect) {
    return res.status(404).json({ message: "Invalid password" });
  }
  const token = jwt.sign({ ...user }, jwtSecret, { expiresIn: "1d" });
  res.status(200).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: null,
    },
  });
});

module.exports = router;
