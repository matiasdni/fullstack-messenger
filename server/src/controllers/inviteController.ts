import { Response } from "express";
import authenticate, { AuthRequest } from "../middlewares/auth";

// /api/invites
const router = require("express").Router();

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  console.log("req.body", req.body);
  res.status(200).json({ message: "ok" });
});

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  res.status(200).json({ message: "ok" });
});

router.put("/", authenticate, async (req: AuthRequest, res: Response) => {
  res.status(200).json({ message: "ok" });
});

export default router;
