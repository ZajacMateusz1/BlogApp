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
  return {
    id: createdUser._id,
    email: createdUser.email,
    password: createdUser.password,
    username: createdUser.username,
  };
};
