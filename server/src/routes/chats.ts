import chatController from "../controllers/chatController";
import authenticate from "../middlewares/auth";

const router = require("express").Router();

router.use(authenticate);

router.post("/", chatController.createChat);

router.get("/:id", chatController.chatById);

router.post("/:id/message", chatController.sendMessage);

router.delete("/:chatId/users/:userId", chatController.removeUserFromChat);

export default router;
