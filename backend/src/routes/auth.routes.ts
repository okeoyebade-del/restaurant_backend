import { Router } from "express";

const router = Router();

// For now: just a placeholder. We'll implement real logic next step.
router.post("/register", (req, res) => {
  res.json({ message: "register route working" });
});

export default router;
