import express from "express";
import authenticate from "../middlewares/auth";
import { deleteInvite, putInviteUpdate } from "../controllers/inviteController";

const router = express.Router();

router.use(authenticate);

router.put("/", putInviteUpdate);

router.delete("/", deleteInvite);

export default router;
