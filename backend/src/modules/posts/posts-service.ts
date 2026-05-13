import mongoose from "mongoose";
import type { EditPostSchemaType } from "./posts-schema";
import {
  addPostRepository,
  addPostToUser,
  removePostRepository,
  removePostFromUser,
  editPostRepository,
  getPostRepository,
} from "./posts-repository";
import HttpError from "../../errors/HttpError";

export const getPostService = async (postId: string) => {
  const post = await getPostRepository(postId);
  if (post === null) throw new HttpError("Post not found", 404);
  const { _id, creator, ...postObject } = post;
  return {
    id: _id,
    creator: { id: creator._id, username: creator.username },
    ...postObject,
  };
};

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
    const { _id, __v, ...postObject } = createdPost.toObject();
    return { id: _id, ...postObject };
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
    const { _id, __v, ...postObject } = removedPost.toObject();
    return { id: _id, ...postObject };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const editPostService = async (
  postId: string,
  userId: string,
  editPostData: EditPostSchemaType,
) => {
  const editedPost = await editPostRepository(postId, userId, editPostData);
  if (editedPost === null) throw new HttpError("Post not found", 404);
  const { _id, __v, ...postObject } = editedPost.toObject();
  return { id: _id, ...postObject };
};
