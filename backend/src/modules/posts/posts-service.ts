import mongoose from "mongoose";
import {
  addPostRepository,
  addPostToUser,
  removePostRepository,
  removePostFromUser,
} from "./posts-repository";
import HttpError from "../../errors/HttpError";
export const addPostService = async (
  title: string,
  image: string,
  description: string,
  userId: string,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const createdPost = await addPostRepository(
      title,
      image,
      description,
      userId,
      session,
    );
    const updatedUser = await addPostToUser(createdPost._id, userId, session);
    if (!updatedUser) throw new HttpError("User not found", 404);
    await session.commitTransaction();
    return createdPost;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const removePostService = async (postId: string, userId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const removedPost = await removePostRepository(postId, userId, session);
    if (!removedPost) throw new HttpError("Post not found", 404);
    await removePostFromUser(postId, userId, session);
    await session.commitTransaction();
    return removedPost;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
