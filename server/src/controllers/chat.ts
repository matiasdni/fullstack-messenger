import { Response } from "express";
import authenticate, { AuthRequest } from "../middlewares/auth";
import { User } from "../models/user";

const router = require("express").Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (user) {
    const user1: any = await User.scope("chatsWithOrderedMessages").findByPk(
      user.dataValues.id
    );
    const chats = user1.get({ plain: true }).chats;
    console.log(chats);
    res.send(chats).status(200);
  }
});

module.exports = router;
