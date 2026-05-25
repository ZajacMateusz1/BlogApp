import User from "../../models/user-model.js";
import Post from "../../models/post-model.js";
import { type ClientSession, Types } from "mongoose";
import type { EditPostSchemaType } from "./posts-schema";
import type { PopulatedPostType } from "./posts-types";

export const getPostRepository = async (postId: string) => {
  return await Post.findById(postId, "-__v")
    .populate("creator", "username")
    .lean<PopulatedPostType>();
};

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
