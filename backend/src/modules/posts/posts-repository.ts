import User from "../../models/user-model";
import Post from "../../models/post-model";
import type { ClientSession } from "mongoose";
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
export const findUserById = async (userId: string) => {
  return await User.findById(userId);
};
