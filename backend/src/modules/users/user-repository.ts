import User from "../../models/user-model";
export const getUsersRepository = async () => {
  return await User.find({}, "-password -__v -posts").lean();
};
