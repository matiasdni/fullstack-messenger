import { Response } from "express";
import authenticate, { AuthRequest } from "../middlewares/auth";
import { rejectInvite, updateInvite } from "../services/inviteService";
import { Invite } from "../../../shared/types";
import { Chat } from "../models/initModels";

const router = require("express").Router();

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  console.log("req.body", req.body);
  res.status(200).json({ message: "ok" });
});

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  res.status(200).json({ message: "ok" });
});

router.put("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const invite: Invite = req.body;
  const result = await updateInvite(invite, user);

  const chat = await Chat.findOne({
    where: { id: result.chatId },
    include: [
      {
        association: "users",
        attributes: ["id", "username"],
      },
    ],
  });
  chat!.addUser(user);

  const returnResult = {
    ...result,
    chat: {
      ...chat!.toJSON(),
      messages: [],
    },
  };
  res.status(200).json(returnResult);
});

router.delete("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const invite: Invite = req.body;
  const result = await rejectInvite({ inviteId: invite.id, userId: user.id });
  res.status(204).json(result);
  console.log("result", result, "success");
});

export default router;
