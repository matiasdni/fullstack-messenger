import {
  chatById,
  createChat,
  sendMessage,
} from "../controllers/chatController";
import authenticate from "../middlewares/auth";

const router = require("express").Router();

router.use(authenticate);

router.post("/", createChat);

router.get("/:id", chatById);

router.post("/:id/message", sendMessage);

export default router;
