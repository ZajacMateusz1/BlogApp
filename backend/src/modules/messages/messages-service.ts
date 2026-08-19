import mongoose from "mongoose";
import {
  addConversationRepository,
  addMessagesRepository,
  findConversationByUsers,
  updateLastMessage,
} from "./messages-repository.js";
import type { MessageDataType } from "./messages-types.js";
import HttpError from "../../errors/HttpError.js";
import {
  findConversation,
  markAsReadRepository,
} from "./messages-repository.js";

export const addMessagesService = async (messageData: MessageDataType) => {
  const session = await mongoose.startSession();
  const message = await session.withTransaction(async () => {
    let conversation = await findConversationByUsers(
      messageData.sender,
      messageData.recipient,
      session,
    );
    if (!conversation) {
      conversation = await addConversationRepository(
        messageData.sender,
        messageData.recipient,
        session,
      );
    }
    const message = await addMessagesRepository(
      messageData,
      conversation._id,
      session,
    );
    await updateLastMessage(conversation._id, message._id, session);
  });
  return message;
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
