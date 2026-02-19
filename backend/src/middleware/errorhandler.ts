import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // If it's an AppError, we use its statusCode
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Otherwise it's unexpected -> 500
  console.error("UNEXPECTED ERROR:", err);
  return res.status(500).json({ message: "Internal server error" });
}
