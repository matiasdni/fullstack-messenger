import { validateUserData } from "../middlewares/validationMiddleware";
import {
  acceptFriendRequest,
  getAll,
  getFriend,
  getFriends,
  getRequests,
  getUser,
  getUserChats,
  newUser,
  rejectFriendRequest,
  removeFriend,
  removeUser,
  searchUser,
  sendFriendRequest,
} from "../controllers/userController";
import authenticate from "../middlewares/auth";

const router = require("express").Router();

router.post("/register", validateUserData, newUser);

router.get("/", getAll);

router.get("/:id", authenticate, getUser);

router.get("/:id/chats", authenticate, getUserChats);

router.get("/:id/friends", authenticate, getFriends);

router.get("/:id/friends/:friendId", authenticate, getFriend);

router.post("/:id/friends/:friendId", authenticate, sendFriendRequest);

router.put(
  "/:senderId/friends/:receiverId/accept",
  authenticate,
  acceptFriendRequest
);

router.put("/:id/friends/:friendId/reject", authenticate, rejectFriendRequest);

router.delete("/:id/friends/:friendId", authenticate, removeFriend);

router.get("/:id/requests", authenticate, getRequests);

router.post("/search", authenticate, searchUser);

router.delete("/:id", authenticate, removeUser);

export default router;
