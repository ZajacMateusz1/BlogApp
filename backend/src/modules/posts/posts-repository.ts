import User from "../../models/user-model";
import Post from "../../models/post-model";
import { type ClientSession, Types } from "mongoose";
import type { EditPostSchemaType } from "./posts-schema";
export const addPostRepository = async (
  title: string,
  image: string,
  description: string,
  userId: string,
  session: ClientSession,
) => {
  const createdPost = new Post({
    title,
    image,
    description,
    creator: userId,
  });
  await createdPost.save({ session });
  return createdPost;
};
export const addPostToUser = async (
  postId: Types.ObjectId,
  userId: string,
  session: ClientSession,
) => {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { posts: postId } },
    { session },
  );
};

export const removePostRepository = async (
  postId: string,
  userId: string,
  session: ClientSession,
) => {
  const removedPost = await Post.findOneAndDelete(
    {
      _id: postId,
      creator: userId,
    },
    { session },
  );
  return removedPost;
};
export const removePostFromUser = async (
  postId: string,
  userId: string,
  session: ClientSession,
) => {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { posts: postId } },
    { session },
  );
};

export const editPostRepository = async (
  postId: string,
  userId: string,
  editPostData: EditPostSchemaType,
) => {
  return await Post.findOneAndUpdate(
    {
      _id: postId,
      creator: userId,
    },
    editPostData,
    { new: true },
  );
};
