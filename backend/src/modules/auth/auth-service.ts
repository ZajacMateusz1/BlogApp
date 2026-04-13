import bcrypt from "bcrypt";
import { registerRepository } from "./auth-repository";
export const registerService = async (
  email: string,
  password: string,
  username: string,
) => {
  password = await bcrypt.hash(password, 12);
  return await registerRepository(email, password, username);
};
export const loginService = () => {};
