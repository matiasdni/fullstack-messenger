import multer from "multer";
import path from "path";
import chatController from "../controllers/chatController";
import authenticate from "../middlewares/auth";
import { ApiError } from "../utils/ApiError";

const router = require("express").Router();

router.use(authenticate);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|svg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new ApiError(
        400,
        "Invalid file type: only images with the following extensions are allowed: jpeg, jpg, png, gif, svg"
      )
    );
  },
}).single("image");

router.post("/", chatController.createChat);

router.get("/:id", chatController.chatById);

router.post("/:id/message", chatController.sendMessage);

router.delete("/:chatId/users/:userId", chatController.removeUserFromChat);

router.put("/:chatId", upload, chatController.updateChat);

export default router;
