import type { Request, Response, NextFunction } from "express";
import type { EditUserSchemaType, FollowSchemaType } from "./user-schema.js";
import HttpError from "../../errors/HttpError.js";
import {
  getUsersService,
  getUserService,
  editUserService,
  getUserPostsService,
  followUserService,
} from "./user-service.js";

import type { TokenPayload } from "../../types/token/jwt-payload-type.js";

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
    const { userId }: TokenPayload = req.userData!;
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
      typeof req.query.cursor === "string" && req.query.cursor !== ""
        ? req.query.cursor
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

// follows

export const followUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { followingId }: FollowSchemaType = req.body;
    const { userId }: TokenPayload = req.userData!;
    const followUserResponse = await followUserService(userId, followingId);
    res.status(201).json(followUserResponse);
  } catch (error) {
    next(error);
  }
};
