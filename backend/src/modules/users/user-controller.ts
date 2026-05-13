import type { Request, Response, NextFunction } from "express";
import { getUsersService, getUserService } from "./user-service";
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getUsersResponse = await getUsersService();
    res.json(getUsersResponse);
  } catch (error) {
    next(error);
  }
};
export const getUser = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const getUserResponse = await getUserService(userId);
    res.json(getUserResponse);
  } catch (error) {
    next(error);
  }
};
