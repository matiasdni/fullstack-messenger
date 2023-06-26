import express from "express";
import { getMe, login, logOut } from "../controllers/authController";

const router = express.Router();

router.post("/", login);

router.get("/", getMe);

router.get("/logout", logOut);

export default router;
