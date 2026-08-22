import type { Request, Response, NextFunction } from "express";
import {
  markAsReadService,
  addConversationService,
  getConversationsService,
  getMessagesService,
  searchConversationService,
} from "./messages-service.js";

export const addConversation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId: loggedUserId } = req.userData!;
    const { userId } = req.body;
    const addConversationResponse = await addConversationService(
      loggedUserId,
      userId,
    );
    res.status(201).json(addConversationResponse);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.userData!;
    const cursor =
      typeof req.query.cursor !== "string" || req.query.cursor === ""
        ? undefined
        : req.query.cursor;
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 10), 10);
    const getConversationsResponse = await getConversationsService(
      userId,
      limit,
      cursor,
    );
    res.json(getConversationsResponse);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: Request<{ conversationId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.userData!;
    const cursor =
      typeof req.query.cursor !== "string" || req.query.cursor === ""
        ? undefined
        : req.query.cursor;
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 10), 10);
    const getMessagesResponse = await getMessagesService(
      conversationId,
      userId,
      cursor,
      limit,
    );
    res.json(getMessagesResponse);
  } catch (error) {
    next(error);
  }
};

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

export const searchConversation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.userData!;
    const searchQuery =
      typeof req.query.search === "string" ? req.query.search : "";
    const searchConversationResponse = await searchConversationService(
      userId,
      searchQuery,
    );
    res.json(searchConversationResponse);
  } catch (error) {
    next(error);
  }
};
