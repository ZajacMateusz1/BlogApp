import User from "../../models/user-model.js";

export const getUsersRepository = async () => {
  return await User.find({}, "-password -__v -posts").lean();
};
export const getUserRepository = async (userId: string) => {
  return await User.findById(userId, "-__v -password -posts -email").lean();
};
