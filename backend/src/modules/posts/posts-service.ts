import mongoose from "mongoose";
import {
  uploadToSupabase,
  removeFromSupabase,
  getpublicUrl,
} from "../../utils/supabaseHelpers";
import type { EditPostSchemaType } from "./posts-schema";
import {
  addPostRepository,
  addPostToUser,
  removePostRepository,
  removePostFromUser,
  editPostRepository,
  getPostRepository,
  findPostById,
} from "./posts-repository.js";
import HttpError from "../../errors/HttpError.js";

export const getPostService = async (postId: string) => {
  const post = await getPostRepository(postId);
  if (post === null) throw new HttpError("Post not found", 404);
  const { _id, creator, imagePath, ...postObject } = post;
  const imageUrl = getpublicUrl(imagePath);
  return {
    id: _id,
    image: imageUrl,
    creator: { id: creator._id, username: creator.username },
    ...postObject,
  };
};

export const addPostService = async (
  title: string,
  imageFile: Express.Multer.File | undefined,
  description: string,
  userId: string,
) => {
  let imagePath = null;
  if (imageFile) {
    imagePath = await uploadToSupabase(imageFile, "posts");
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const createdPost = await addPostRepository(
      title,
      imagePath,
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
    if (imagePath) {
      await removeFromSupabase(imagePath);
    }
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
    const { _id, imagePath, __v, ...postObject } = removedPost.toObject();
    if (imagePath) await removeFromSupabase(imagePath);
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
  editPostData: EditPostSchemaType & { imagePath?: string },
  imageFile: Express.Multer.File | undefined,
) => {
  const oldPostData = await findPostById(postId);
  if (imageFile) {
    const newImagePath = await uploadToSupabase(imageFile, "posts");
    editPostData = { ...editPostData, imagePath: newImagePath };
  }
  const editedPost = await editPostRepository(postId, userId, editPostData);
  if (editedPost === null) throw new HttpError("Post not found", 404);
  if (oldPostData && oldPostData.imagePath) {
    await removeFromSupabase(oldPostData.imagePath);
  }
  const { _id, __v, ...postObject } = editedPost.toObject();
  return { id: _id, ...postObject };
};
