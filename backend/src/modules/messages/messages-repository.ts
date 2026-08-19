import type { Types, ClientSession } from "mongoose";
import Conversation from "../../models/conversation-model.js";
import Message from "../../models/message-model.js";
import type { MessageDataType } from "./messages-types.js";

export const addMessagesRepository = async (
  messageData: MessageDataType,
  conversation: Types.ObjectId,
  session: ClientSession,
) => {
  const message = new Message({ ...messageData, conversation });
  await message.save({ session });
  return message;
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

export const findConversationByUsers = (
  userId1: string,
  userId2: string,
  session?: ClientSession,
) => {
  const [user1, user2] = [userId1, userId2].sort() as [string, string];
  return Conversation.findOne({
    user1,
    user2,
  })
    .session(session || null)
    .lean();
};

export const addConversationRepository = (
  userId1: string,
  userId2: string,
  session: ClientSession,
) => {
  const [user1, user2] = [userId1, userId2].sort() as [string, string];
  const conversation = new Conversation({ user1, user2 });
  conversation.save({ session });
  return conversation;
};

export const updateLastMessage = (
  conversationId: string | Types.ObjectId,
  messageId: Types.ObjectId,
  session: ClientSession,
) => {
  return Conversation.findByIdAndUpdate(
    conversationId,
    {
      $set: { lastMessage: messageId },
    },
    session,
  );
};
