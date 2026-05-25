import type { Request, Response, NextFunction } from "express";
import type { PostSchemaType, EditPostSchemaType } from "./posts-schema";
import {
  addPostService,
  removePostService,
  editPostService,
  getPostService,
} from "./posts-service.js";
import type { TokenPayload } from "../../types/token/jwt-payload-type";

export const getPost = async (
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;
    const getPostResponse = await getPostService(postId);
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
    const { title, image, description }: PostSchemaType = req.body;
    const { userId }: TokenPayload = req.userData!;
    const addPostResponse = await addPostService(
      title,
      image,
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
    const { userId }: TokenPayload = req.userData!;
    const editPostRespone = await editPostService(postId, userId, editPostData);
    res.status(200).json(editPostRespone);
  } catch (error) {
    next(error);
  }
};
