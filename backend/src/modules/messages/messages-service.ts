import { addMessagesRepository } from "./messages-repository.js";
import type { MessageDataType } from "./messages-types.js";
import HttpError from "../../errors/HttpError.js";
import {
  findConversation,
  markAsReadRepository,
} from "./messages-repository.js";

export const addMessagesService = async (messageData: MessageDataType) => {
  await addMessagesRepository(messageData);
};

export const markAsReadService = async (
  conversationId: string,
  userId: string,
) => {
  const conversation = await findConversation(conversationId, userId);
  if (!conversation) {
    throw new HttpError("Conversation not found", 404);
  }
  const isUser1 = conversation.user1.toString() === userId;
  await markAsReadRepository(conversationId, isUser1);
};
