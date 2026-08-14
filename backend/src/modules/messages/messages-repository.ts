import Message from "../../models/message-model.js";
import type { MassageDataType } from "./messages-types.js";

export const addMessagesRepository = async (messageData: MassageDataType) => {
  const message = new Message(messageData);
  await message.save();
};
