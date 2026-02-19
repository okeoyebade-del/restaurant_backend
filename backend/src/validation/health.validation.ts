import Joi from "joi";

export const createHealthReadingSchema = Joi.object({
  weight_kg: Joi.number().positive().required(),
  body_fat_percent: Joi.number().min(0).max(100).optional(),
  muscle_mass_kg: Joi.number().positive().optional(),
  bmi: Joi.number().positive().optional(),
  recorded_at: Joi.date().optional(),
});
