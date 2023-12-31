import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";

const errorHandler = (err: any, req: Request, res: Response) => {
  logger.error(err);
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Unexpected error" });
  }
};

export default errorHandler;
