import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../db";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username,
    },
  });

  console.log("user", user);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordCorrect = await user.comparePassword(password);
  console.log("passwordCorrect", passwordCorrect);
  if (!passwordCorrect) {
    return res.status(404).json({ message: "Invalid password" });
  }
  const token = jwt.sign({ ...user }, process.env.JWT_SECRET!);
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
