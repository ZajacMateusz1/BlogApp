import type { Request, Response, NextFunction } from "express";
import {
  getNotificationsService,
  markAsReadService,
} from "./notification-service.js";

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.userData!;
    const cursor =
      typeof req.query.cursor === "string" && req.query.cursor !== ""
        ? req.query.cursor
        : undefined;
    const limit = Math.max(Math.min(Number(req.query.limit) || 10), 1);
    const getNotificationsResponse = await getNotificationsService(
      userId,
      cursor,
      limit,
    );
    res.json(getNotificationsResponse);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.userData!;
    await markAsReadService(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
