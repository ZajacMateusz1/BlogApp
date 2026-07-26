import type { Request, Response, NextFunction } from "express";
import { getFeedService } from "./feed-service.js";

export const getFeed = async (
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
    const limit = Math.max(1, Math.min(10, Number(req.query.limit) || 10));
    const getFeedResponse = await getFeedService(userId, cursor, limit);
    res.json(getFeedResponse);
  } catch (error) {
    next(error);
  }
};
