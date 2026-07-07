import mongoose from "mongoose";
import {
  uploadToSupabase,
  removeFromSupabase,
  getpublicUrl,
} from "../../utils/supabaseHelpers.js";
import type { EditPostSchemaType } from "./posts-schema";
import {
  addPostRepository,
  addPostToUser,
  removePostRepository,
  removePostFromUser,
  editPostRepository,
  getPostRepository,
  findPostById,
  addLikeRepository,
  removeLikeRepository,
  getLikesCount,
  getIsLiked,
  addCommentRepository,
  getCommentsRepository,
} from "./posts-repository.js";
import HttpError from "../../errors/HttpError.js";

export const getPostService = async (postId: string, userId: string) => {
  const post = await getPostRepository(postId);
  if (post === null) throw new HttpError("Post not found", 404);
  const [likesCount, isLiked] = await Promise.all([
    getLikesCount(postId),
    getIsLiked(postId, userId),
  ]);
  const { _id, creator, imagePath, ...postObject } = post;
  const imageUrl = getpublicUrl(imagePath);
  const avatarUrl = getpublicUrl(creator.avatarPath);
  return {
    id: _id,
    image: imageUrl,
    creator: { id: creator._id, username: creator.username, avatar: avatarUrl },
    ...postObject,
    likesCount,
    isLiked,
  };
};

export const addPostService = async (
  title: string,
  imageFile: Express.Multer.File,
  description: string,
  userId: string,
) => {
  const imagePath = await uploadToSupabase(imageFile, "posts");
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
    if (imagePath) {
      try {
        await removeFromSupabase(imagePath);
      } catch (error) {
        console.error(`Failed to remove image ${error}`);
      }
    }
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
  let newImagePath: string | undefined = undefined;
  const oldPostData = await findPostById(postId);
  if (!oldPostData) throw new HttpError("Post not found", 404);
  if (imageFile) {
    newImagePath = await uploadToSupabase(imageFile, "posts");
    editPostData = { ...editPostData, imagePath: newImagePath };
  }
  try {
    const editedPost = await editPostRepository(postId, userId, editPostData);
    if (editedPost === null) throw new HttpError("Post not found", 404);
    if (imageFile) {
      try {
        await removeFromSupabase(oldPostData.imagePath);
      } catch (error) {
        console.error(`Failed to remove old image ${error}`);
      }
    }
    const { _id, __v, ...postObject } = editedPost;
    return { id: _id, ...postObject };
  } catch (error) {
    if (newImagePath) {
      try {
        await removeFromSupabase(newImagePath);
      } catch (removeError) {
        console.error(`Failed to remove new image, ${removeError}`);
      }
    }
    throw error;
  }
};

// Likes

export const addLikeService = async (postId: string, userId: string) => {
  const { _id, __v, ...createdLike } = (
    await addLikeRepository(postId, userId)
  ).toObject();
  return {
    ...createdLike,
    id: _id,
  };
};

export const removeLikeService = async (postId: string, userId: string) => {
  const removedLike = await removeLikeRepository(postId, userId);
  if (removedLike === null) throw new HttpError("Like not found", 404);
  return removedLike;
};

// Comments

export const addCommentService = async (
  postId: string,
  userId: string,
  content: string,
) => {
  const { _id, __v, ...createdComment } = (
    await addCommentRepository(postId, userId, content)
  ).toObject();
  return {
    ...createdComment,
    id: _id,
  };
};

export const getCommentsService = async (
  postId: string,
  cursor: string | undefined,
  limit: number,
) => {
  const comments = await getCommentsRepository(postId, cursor, limit);
  const nextCursor = comments.at(-1)?._id;
  return {
    comments: comments.map(({ _id, ...comment }) => ({ id: _id, ...comment })),
    nextCursor,
  };
};
