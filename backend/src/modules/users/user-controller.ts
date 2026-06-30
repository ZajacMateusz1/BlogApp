import type { Request, Response, NextFunction } from "express";
import type { EditUserSchemaType } from "./user-schema.js";
import HttpError from "../../errors/HttpError.js";
import {
  getUsersService,
  getUserService,
  editUserService,
  getUserPostsService,
} from "./user-service.js";

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

export const editUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.userData!;
    const avatarFile = req.file;
    const editUserData: EditUserSchemaType = req.body;

    if (Object.keys(editUserData).length == 0 && !avatarFile) {
      throw new HttpError("You must provide at least one change", 422);
    }

    const editUserResponse = await editUserService(
      userId,
      editUserData,
      avatarFile,
    );
    res.json(editUserResponse);
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(Number(req.query.limit) || 10, 10);
    const cursor =
      typeof req.query.cursor === "string"
        ? typeof req.query.cursor
        : undefined;
    const getUserPostsResponse = await getUserPostsService(
      userId,
      limit,
      cursor,
    );
    res.json(getUserPostsResponse);
  } catch (error) {
    next(error);
  }
};
