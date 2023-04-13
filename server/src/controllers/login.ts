import express, { Request, Response } from "express";
import { User } from "../db";
import jwt from "jsonwebtoken";

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
  const token = jwt.sign(user.id, process.env.JWT_SECRET! || "secret");
  res.status(200).json({ token, username: user.username, id: user.id });
});

module.exports = router;
