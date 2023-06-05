import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Unexpected error" });
  }
};

export default errorHandler;
