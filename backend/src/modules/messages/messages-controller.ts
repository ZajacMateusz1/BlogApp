import type { Request, Response, NextFunction } from "express";
import { markAsReadService } from "./messages-service.js";

export const markAsRead = async (
  req: Request<{ conversationId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.userData!;
    await markAsReadService(conversationId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
