import type { Request, Response, NextFunction } from "express";
import type {
  PostSchemaType,
  EditPostSchemaType,
  CommentSchemaType,
} from "./posts-schema";
import {
  addPostService,
  removePostService,
  editPostService,
  getPostService,
  addLikeService,
  removeLikeService,
  addCommentService,
  getCommentsService,
} from "./posts-service.js";
import type { TokenPayload } from "../../types/token/jwt-payload-type";
import HttpError from "../../errors/HttpError.js";

export const getPost = async (
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const { userId }: TokenPayload = req.userData!;
    const getPostResponse = await getPostService(postId, userId);
    res.json(getPostResponse);
  } catch (error) {
    next(error);
  }
};

export const addPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description }: PostSchemaType = req.body;
    const imageFile = req.file;
    if (!imageFile) throw new HttpError("Image is required", 422);
    const { userId }: TokenPayload = req.userData!;
    const addPostResponse = await addPostService(
      title,
      imageFile,
      description,
      userId,
    );
    res.status(201).json(addPostResponse);
  } catch (error) {
    next(error);
  }
};

export const removePost = async (
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const { userId }: TokenPayload = req.userData!;
    await removePostService(postId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const editPost = async (
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const editPostData: EditPostSchemaType = req.body;
    const imageFile = req.file;
    const { userId }: TokenPayload = req.userData!;

    if (Object.keys(editPostData).length == 0 && !imageFile)
      throw new HttpError("You must provide at least one change", 422);

    const editPostRespone = await editPostService(
      postId,
      userId,
      editPostData,
      imageFile,
    );
    res.json(editPostRespone);
  } catch (error) {
    next(error);
  }
};

// Likes

export const addLike = async (
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const { userId }: TokenPayload = req.userData!;
    const addLikeResponse = await addLikeService(postId, userId);
    res.status(201).json(addLikeResponse);
  } catch (error) {
    next(error);
  }
};

export const reomveLike = async (
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const { userId }: TokenPayload = req.userData!;
    await removeLikeService(postId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Comments

export const addComment = async (
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const { userId }: TokenPayload = req.userData!;
    const { content }: CommentSchemaType = req.body;
    const addCommentResponse = await addCommentService(postId, userId, content);
    res.status(201).json(addCommentResponse);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params!;
    const limit = Math.min(Number(req.query.limit) || 10, 10);
    const cursor =
      typeof req.query.cursor === "string" && req.query.cursor !== ""
        ? req.query.cursor
        : undefined;
    const getCommentsResponse = await getCommentsService(postId, cursor, limit);
    res.json(getCommentsResponse);
  } catch (error) {
    next(error);
  }
};
