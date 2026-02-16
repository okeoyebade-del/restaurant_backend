import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { prisma } from "../config/prisma";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    biometric_enabled: user.biometric_enabled,
    created_at: user.created_at,
    profile: user.profile,
  });
});

export default router;
