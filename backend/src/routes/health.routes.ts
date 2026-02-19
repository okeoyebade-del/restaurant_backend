import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { prisma } from "../config/prisma";
import { validate } from "../middleware/validate";
import { createHealthReadingSchema } from "../validation/health.validation";

const router = Router();

/**
 * POST /api/v1/health/readings
 * Body: { weight_kg, body_fat_percent?, muscle_mass_kg?, bmi?, recorded_at? }
 */
router.post(
  "/readings",
  requireAuth,
  validate(createHealthReadingSchema),
  async (req, res) => {
    const userId = req.userId!;

    const { weight_kg, body_fat_percent, muscle_mass_kg, bmi, recorded_at } =
      req.body;

    const reading = await prisma.healthReading.create({
      data: {
        user_id: userId,
        weight_kg: Number(weight_kg),
        body_fat_percent:
          body_fat_percent != null ? Number(body_fat_percent) : null,
        muscle_mass_kg: muscle_mass_kg != null ? Number(muscle_mass_kg) : null,
        bmi: bmi != null ? Number(bmi) : null,
        recorded_at: recorded_at ? new Date(recorded_at) : undefined,
      },
    });

    return res.status(201).json(reading);
  }
);

/**
 * GET /api/v1/health/readings
 * Returns logged-in user's readings (newest first)
 */
router.get("/readings", requireAuth, async (req, res) => {
  const userId = req.userId!;

  const readings = await prisma.healthReading.findMany({
    where: { user_id: userId },
    orderBy: { recorded_at: "desc" },
    take: 50,
  });

  return res.json({ readings });
});

/**
 * GET /api/v1/health/summary
 * Returns basic progress metrics for the logged-in user.
 */
router.get("/summary", requireAuth, async (req, res) => {
  const userId = req.userId!;

  const latest = await prisma.healthReading.findFirst({
    where: { user_id: userId },
    orderBy: { recorded_at: "desc" },
  });

  if (!latest) {
    return res.json({
      hasData: false,
      message: "No health readings yet",
    });
  }

  const previous = await prisma.healthReading.findFirst({
    where: { user_id: userId, recorded_at: { lt: latest.recorded_at } },
    orderBy: { recorded_at: "desc" },
  });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const oldestIn7d = await prisma.healthReading.findFirst({
    where: { user_id: userId, recorded_at: { gte: sevenDaysAgo } },
    orderBy: { recorded_at: "asc" },
  });

  const changeSincePrevious = previous
    ? latest.weight_kg - previous.weight_kg
    : null;

  const changeLast7Days = oldestIn7d
    ? latest.weight_kg - oldestIn7d.weight_kg
    : null;

  return res.json({
    hasData: true,
    latest: {
      recorded_at: latest.recorded_at,
      weight_kg: latest.weight_kg,
      body_fat_percent: latest.body_fat_percent,
      muscle_mass_kg: latest.muscle_mass_kg,
      bmi: latest.bmi,
    },
    changeSincePrevious,
    changeLast7Days,
  });
});

export default router;
