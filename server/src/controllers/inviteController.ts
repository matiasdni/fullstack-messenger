import { Response } from "express";
import { Invite } from "../../../shared/types";
import { connectedClients } from "../listeners/socketHandler";
import { mySocket } from "../listeners/types";
import authenticate, { AuthRequest } from "../middlewares/auth";
import { Chat } from "../models/chat";
import { io } from "../server";
import { rejectInvite, updateInvite } from "../services/inviteService";

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
  await chat!.addUser(user);

  await chat!.reload();

  const returnResult = {
    ...result,
    chat: {
      ...chat!.toJSON(),
      messages: [],
    },
  };

  // broadcast to all users in the chat
  const chatId = result.chatId;
  io.to(chatId).emit("chatUpdate", {
    id: chat!.id,
    users: chat!.users,
  });

  const userSockets = connectedClients[user.id];
  userSockets.forEach((socket: mySocket) => {
    socket.join(chatId);
  });

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
