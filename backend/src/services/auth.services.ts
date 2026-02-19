import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { AppError } from "../utils/appError";

type RegisterInput = {
  email: string;
  password: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  height_cm: number;
  current_weight_kg: number;
  health_goal: string;
};

export async function registerUser(input: RegisterInput) {
  // Check if email is already used
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
  throw new AppError("Email already in use", 409);
}

  //  Hash password 
  const password_hash = await bcrypt.hash(input.password, 12);

  //  Create user + profile in one go
  const user = await prisma.user.create({
    data: {
      email: input.email,
      password_hash,
      profile: {
        create: {
          full_name: input.full_name,
          date_of_birth: new Date(input.date_of_birth),
          gender: input.gender,
          height_cm: Number(input.height_cm),
          current_weight_kg: Number(input.current_weight_kg),
          health_goal: input.health_goal,
        },
      },
    },
    include: { profile: true },
  });

  // 4) Return safe user object (no password_hash)
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    biometric_enabled: user.biometric_enabled,
    created_at: user.created_at,
    profile: user.profile,
  };
}

type LoginInput = {
  email: string;
  password: string;
};

// function signAccessToken(userId: string, role: string) {
//   return jwt.sign(
//     { sub: userId, role },
//     process.env.JWT_SECRET!,
//     { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
//   );
// }


function signAccessToken(userId: string, role: string) {
  const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as SignOptions["expiresIn"];
  return jwt.sign({ sub: userId, role }, process.env.JWT_SECRET!, { expiresIn });
}


export async function loginUser(input: LoginInput) {
  // 1) Find user by email
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { profile: true },
  });

  if (!user) {
  throw new AppError("Invalid email or password", 401);
}


  // 2) Check password
  const ok = await bcrypt.compare(input.password, user.password_hash);
  if (!ok) {
  throw new Error("Invalid email or password");
}

  // 3) Create JWT token
  const accessToken = signAccessToken(user.id, user.role);

  // 4) Return token + safe user object
  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      biometric_enabled: user.biometric_enabled,
      created_at: user.created_at,
      profile: user.profile,
    },
  };
}


