import mongoose from "mongoose";
import { addPostRepository, findUserById } from "./posts-repository";
import HttpError from "../../errors/HttpError";
export const addPostService = async (
  title: string,
  image: string,
  description: string,
  userId: string,
) => {
  const user = await findUserById(userId);
  if (!user) throw new HttpError("Creating place failed", 500);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const createdPost = await addPostRepository(
      title,
      image,
      description,
      userId,
      session,
    );
    user.posts.push(createdPost._id);
    await user.save();
    await session.commitTransaction();
    await session.endSession();
    return createdPost;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
};
