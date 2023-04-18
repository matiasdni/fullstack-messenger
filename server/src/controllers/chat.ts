import { Response } from "express";
import authenticate, { AuthRequest } from "../middlewares/auth";

const router = require("express").Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (user) {
    const chats = await user.getChats({
      scope: "withUsersAndMessages",
    });
    console.log(chats);
    res.send(chats).status(200);
  }
});

module.exports = router;
