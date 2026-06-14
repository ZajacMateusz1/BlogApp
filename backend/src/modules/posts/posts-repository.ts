import User from "../../models/user-model.js";
import Post from "../../models/post-model.js";
import { type ClientSession, Types } from "mongoose";
import type { EditPostSchemaType } from "./posts-schema";
import type { PopulatedPostType } from "./posts-types";

export const getPostRepository = (postId: string) => {
  return Post.findById(postId, "-__v")
    .populate("creator", "username avatarPath")
    .lean<PopulatedPostType>();
};

export const addPostRepository = async (
  title: string,
  imagePath: string | null,
  description: string,
  userId: string,
  session: ClientSession,
) => {
  const createdPost = new Post({
    title,
    imagePath,
    description,
    creator: userId,
  });
  await createdPost.save({ session });
  return createdPost;
};
export const addPostToUser = (
  postId: Types.ObjectId,
  userId: string,
  session: ClientSession,
) => {
  return User.findByIdAndUpdate(
    userId,
    { $push: { posts: postId } },
    { session },
  );
};

export const removePostRepository = (
  postId: string,
  userId: string,
  session: ClientSession,
) => {
  const removedPost = Post.findOneAndDelete(
    {
      _id: postId,
      creator: userId,
    },
    { session },
  );
  return removedPost;
};
export const removePostFromUser = (
  postId: string,
  userId: string,
  session: ClientSession,
) => {
  return User.findByIdAndUpdate(
    userId,
    { $pull: { posts: postId } },
    { session },
  );
};

export const findPostById = (postId: string) => {
  return Post.findById(postId).lean();
};

export const editPostRepository = (
  postId: string,
  userId: string,
  editPostData: EditPostSchemaType & { imagePath?: string },
) => {
  return Post.findOneAndUpdate(
    {
      _id: postId,
      creator: userId,
    },
    editPostData,
    { returnDocument: "after" },
  ).lean();
};
