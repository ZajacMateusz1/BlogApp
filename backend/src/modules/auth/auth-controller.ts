import type { Request, Response, NextFunction } from "express";
import { registerService, loginService } from "./auth-service";
import { type RegisterSchemaType } from "./auth-schema";
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, username }: RegisterSchemaType = req.body;
    const registerResponse = await registerService(email, password, username);
    res.status(201).json(registerResponse);
  } catch (error) {
    next(error);
  }
};
export const login = () => {};
