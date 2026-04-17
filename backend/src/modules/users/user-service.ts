import { getUsersRepository } from "./user-repository";
export const getUsersService = async () => {
  const users = await getUsersRepository();
  return users.map(({ _id, ...rest }) => ({
    id: _id,
    ...rest,
  }));
};
