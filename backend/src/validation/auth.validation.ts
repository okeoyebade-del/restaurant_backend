import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),

  full_name: Joi.string().min(2).required(),
  date_of_birth: Joi.string().required(), 
  gender: Joi.string().required(),
  height_cm: Joi.number().positive().required(),
  current_weight_kg: Joi.number().positive().required(),
  health_goal: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
