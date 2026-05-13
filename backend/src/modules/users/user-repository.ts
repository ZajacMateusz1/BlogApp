import User from "../../models/user-model";
import Post from "../../models/post-model";

export const getUsersRepository = async () => {
  return await User.find({}, "-password -__v -posts").lean();
};
export const getUserRepository = async (userId: string) => {
  return await User.findById(userId, "-__v -password -posts -email").lean();
};
export const getUserPosts = async (userId: string) => {
  return await Post.find({ creator: userId }, "-__v")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
};
