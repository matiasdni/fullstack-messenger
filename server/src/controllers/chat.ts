import { Response } from "express";
import authenticate, { AuthRequest } from "../middlewares/auth";
import { Message } from "../models/message";
import { User } from "../models/user";

const router = require("express").Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (user) {
    // get user's chats
    const chats = await user.getChats({
      nest: true,
      attributes: ["id", "name", "description", "updatedAt"],
      include: [
        {
          model: User,
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
        {
          model: Message,
          attributes: ["id", "content", "createdAt"],
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: User,
              attributes: ["id"],
            },
          ],
        },

      ],
    });
    res.send(chats).status(200);
  }


});




module.exports = router;
