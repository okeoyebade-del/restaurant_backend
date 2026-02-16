import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export function validate(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // show all errors
      stripUnknown: true, // remove unknown fields
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    req.body = value;
    next();
  };
}
