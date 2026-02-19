import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.services";


export async function register(req: Request, res: Response) {
  try {
    const createdUser = await registerUser(req.body);
    return res.status(201).json(createdUser);
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Login failed" });
  }
}

