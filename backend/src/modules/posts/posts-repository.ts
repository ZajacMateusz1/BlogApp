import User from "../../models/user-model.js";
import Post from "../../models/post-model.js";
import Like from "../../models/like-model.js";
import Comment from "../../models/comment-model.js";
import { type ClientSession, Types } from "mongoose";
import type { EditPostSchemaType } from "./posts-schema";
import type { PopulatedPostType, PopulatedCommentType } from "./posts-types";

export const getPostRepository = (postId: string) => {
  return Post.findById(postId, "-__v")
    .populate("creator", "username avatarPath")
    .lean<PopulatedPostType>();
};

export const getPostCreator = async (postId: string) => {
  return await Post.findById(postId).select("creator -_id");
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

// Likes

export const addLikeRepository = async (
  postId: string,
  userId: string,
  session: ClientSession,
) => {
  const createdLike = new Like({
    user: userId,
    post: postId,
  });
  await createdLike.save({ session });
  return createdLike;
};

export const incrementPostLikes = (postId: string, session: ClientSession) => {
  return Post.updateOne(
    { _id: postId },
    { $inc: { likesCount: 1 } },
    { session },
  );
};

export const decrementPostLikes = (postId: string, session: ClientSession) => {
  return Post.updateOne(
    { _id: postId },
    { $inc: { likesCount: -1 } },
    { session },
  );
};

export const removeLikeRepository = (
  postId: string,
  userId: string,
  session: ClientSession,
) => {
  return Like.findOneAndDelete(
    {
      post: postId,
      user: userId,
    },
    { session },
  );
};

export const getIsLiked = async (postId: string, userId: string) => {
  return Boolean(await Like.exists({ post: postId, user: userId }));
};

export const removeAllPostLikes = (postId: string, session: ClientSession) => {
  return Like.deleteMany({ post: postId }, { session });
};

// Comments

export const addCommentRepository = async (
  postId: string,
  userId: string,
  content: string,
  session: ClientSession,
) => {
  const createdComment = new Comment({
    post: postId,
    author: userId,
    content,
  });
  await createdComment.save({ session });
  return createdComment;
};

export const incrementPostComments = (
  postId: string,
  session: ClientSession,
) => {
  return Post.updateOne(
    { _id: postId },
    { $inc: { commentsCount: 1 } },
    { session },
  );
};

export const getCommentsRepository = (
  postId: string,
  cursor: string | undefined,
  limit: number,
) => {
  const filters = cursor
    ? { post: postId, _id: { $lt: cursor } }
    : { post: postId };
  return Comment.find(filters, "-__v")
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("author", "username avatarPath")
    .lean<PopulatedCommentType[]>();
};

export const removeAllPostComments = (
  postId: string,
  session: ClientSession,
) => {
  return Comment.deleteMany({ post: postId }, { session });
};
