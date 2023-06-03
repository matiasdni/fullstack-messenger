import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { jwtSecret } from "../config";
import friendService from "../services/friendService";
import { getPendingInvites } from "../services/inviteService";

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

  const friends = await friendService.getFriends(user.id);
  const friendRequests = await friendService.getFriendRequests(user.id);
  const sentFriendRequests = await friendService.getSentFriendRequests(user.id);
  const chatInvites = await getPendingInvites({ userId: user.id });

  res.status(200).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      chatInvites,
      friends,
      friendRequests,
      sentFriendRequests,
    },
  });
});

export default router;
