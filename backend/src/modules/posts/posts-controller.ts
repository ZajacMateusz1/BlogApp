import type { Request, Response, NextFunction } from "express";
import { PostSchemaType } from "./posts-schema";
import { addPostService, removePostService } from "./posts-service";
import type { TokenPayload } from "../../types/token/jwt-payload-type";
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
    const removePostResponse = await removePostService(postId!, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
