import { Types, type ClientSession } from "mongoose";
import Conversation from "../../models/conversation-model.js";
import Message from "../../models/message-model.js";
import User from "../../models/user-model.js";
import type {
  MessageDataType,
  PopulatedConversationType,
} from "./messages-types.js";

export const addConversationRepository = (userId1: string, userId2: string) => {
  const [user1, user2] = [userId1, userId2].sort() as [string, string];
  const conversation = new Conversation({ user1, user2 });
  conversation.save();
  return conversation;
};

export const getConversationsRepository = (
  userId: string,
  limit: number,
  cursor: string | undefined,
) => {
  const filters = cursor
    ? {
        updatedAt: { $lt: cursor },
        $or: [{ user1: userId }, { user2: userId }],
      }
    : {
        $or: [{ user1: userId }, { user2: userId }],
      };
  return Conversation.find(filters)
    .sort({ updatedAt: -1 })
    .populate("lastMessage", "content createdAt")
    .select("-__v")
    .limit(limit)
    .lean<PopulatedConversationType[]>();
};

export const getMessagesRepository = (
  conversationId: string,
  userId: string,
  cursor: string | undefined,
  limit: number,
) => {
  const filters = cursor
    ? {
        conversation: conversationId,
        $lt: { _id: cursor },
        $or: [{ sender: userId }, { recipient: userId }],
      }
    : {
        conversation: conversationId,
        $or: [{ sender: userId }, { recipient: userId }],
      };
  return Message.find(filters).sort({ _id: -1 }).limit(limit).lean();
};

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

export const markAsUnread = (
  conversationId: Types.ObjectId,
  isUser1: boolean,
) => {
  return isUser1
    ? Conversation.findByIdAndUpdate(conversationId, {
        $set: { isReadUser1: false },
      })
    : Conversation.findByIdAndUpdate(conversationId, {
        $set: { isReadUser2: false },
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

export const searchConversationRepository = (
  userId: string,
  usersIds: string[],
) => {
  return Conversation.find({
    $and: [
      {
        $or: [{ user1: userId }, { user2: userId }],
      },
      {
        $or: [{ user1: { $in: usersIds } }, { user2: { $in: usersIds } }],
      },
    ],
  })
    .limit(5)
    .populate("lastMessage", "content createdAt")
    .select("-__v")
    .lean<PopulatedConversationType[]>();
};

export const searchUsersForConversationRepository = (
  userId: string,
  usersWithConversationIds: Types.ObjectId[],
  searchQuery: string,
) => {
  const escapedSearchQuery = RegExp.escape(searchQuery);
  return User.find({
    _id: { $nin: [...usersWithConversationIds, new Types.ObjectId(userId)] },
    username: { $regex: escapedSearchQuery, $options: "i" },
  });
};

export const findUserConversations = (userId: string) => {
  return Conversation.find({
    $or: [{ user1: userId }, { user2: userId }],
  })
    .select("user1 user2")
    .lean();
};
