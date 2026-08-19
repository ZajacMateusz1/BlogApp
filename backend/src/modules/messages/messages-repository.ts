import Conversation from "../../models/conversation-model.js";
import Message from "../../models/message-model.js";
import type { MessageDataType } from "./messages-types.js";

export const addMessagesRepository = async (messageData: MessageDataType) => {
  const message = new Message(messageData);
  await message.save();
};

export const markAsReadRepository = (
  conversationId: string,
  isUser1: boolean,
) => {
  return isUser1
    ? Conversation.findByIdAndUpdate(conversationId, {
        $set: { isReadUser1: true },
      })
    : Conversation.findByIdAndUpdate(conversationId, {
        $set: { isReadUser2: true },
      });
};

export const findConversation = (conversationId: string, userId: string) => {
  return Conversation.findOne({
    _id: conversationId,
    $or: [{ user1: userId }, { user2: userId }],
  }).lean();
};
