import { NextFunction, Request, Response } from "express";

interface RegisterRequestBody {
  username?: string;
  password?: string;
}

export function validateUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, password } = req.body as RegisterRequestBody;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Check if username and password are at least 3 characters long,
  if (username.length < 3 || password.length < 3) {
    return res.status(400).json({
      error: "Username and password must be at least 3 characters long",
    });
  }

  next();
}
