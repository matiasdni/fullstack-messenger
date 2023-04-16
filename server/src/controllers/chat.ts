import { Response } from "express";
import authenticate, { AuthRequest } from "../middlewares/auth";

const router = require("express").Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (user) {
    // get user's chats
    const chats = await user.getChats();
    res.status(200).json(chats);
  }
});

module.exports = router;
