import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("ERROR:", err);

  const message = err?.message || "Something went wrong";
  return res.status(500).json({ message });
}
