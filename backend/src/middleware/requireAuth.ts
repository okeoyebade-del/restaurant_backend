import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type Payload = {
  sub: string; // user id
  role: string;
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  // Must look like: "Bearer <token>"
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as Payload;

    // attach userId to request
    req.userId = payload.sub;

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
