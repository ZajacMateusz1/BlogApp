import User from "../../models/user-model";
export const registerRepository = async (
  email: string,
  password: string,
  username: string,
) => {
  const user = new User({
    email,
    password,
    username,
  });
  const createdUser = await user.save();
  return createdUser;
};
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};
