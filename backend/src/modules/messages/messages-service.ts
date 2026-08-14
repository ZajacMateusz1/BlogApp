import { addMessagesRepository } from "./messages-repository.js";
import type { MassageDataType } from "./messages-types.js";
export const addMessagesService = async (messageData: MassageDataType) => {
  await addMessagesRepository(messageData);
};
