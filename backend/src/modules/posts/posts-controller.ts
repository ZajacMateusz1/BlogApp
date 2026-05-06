import type { Request, Response, NextFunction } from "express";
import { PostSchemaType } from "./posts-schema";
import { addPostService } from "./posts-service";
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
