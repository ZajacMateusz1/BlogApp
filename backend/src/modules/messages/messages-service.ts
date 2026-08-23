import mongoose from "mongoose";
import {
  addConversationRepository,
  addMessagesRepository,
  findConversationByUsers,
  updateLastMessage,
  getConversationsRepository,
  getMessagesRepository,
  findConversation,
  markAsReadRepository,
  markAsUnread,
  searchConversationRepository,
  searchUsersForConversationRepository,
} from "./messages-repository.js";
import {
  getUserExists,
  getUsersByIds,
  searchUserRepository,
} from "../users/user-repository.js";
import { getPublicUrl } from "../../utils/supabaseHelpers.js";
import type { MessageDataType } from "./messages-types.js";
import HttpError from "../../errors/HttpError.js";

export const addConversationService = async (
  user1Id: string,
  user2Id: string,
) => {
  if (user1Id === user2Id) {
    throw new HttpError("Cannot create conversation with yourself", 400);
  }
  const user2Exists = await getUserExists(user2Id);
  if (!user2Exists) {
    throw new HttpError(
      "Cannot create conversation with non-existent user",
      404,
    );
  }
  const createdConversation = await addConversationRepository(user1Id, user2Id);
  return {
    id: createdConversation._id,
    user1: createdConversation.user1,
    user2: createdConversation.user2,
  };
};

export const getConversationsService = async (
  userId: string,
  limit: number,
  cursor: string | undefined,
) => {
  const conversations = await getConversationsRepository(userId, limit, cursor);
  const otherUserIds = conversations.map((conversation) =>
    conversation.user1.toString() === userId
      ? conversation.user2
      : conversation.user1,
  );
  const otherUsers = await getUsersByIds(otherUserIds);
  const otherUsersMap = new Map();
  otherUsers.forEach((user) =>
    otherUsersMap.set(user._id.toString(), {
      id: user._id,
      username: user.username,
      avatar: getPublicUrl(user.avatarPath),
    }),
  );
  const conversationsResponse = conversations.map((conversation) => {
    const isUser1 = conversation.user1.toString() === userId;
    const lastMessage = conversation.lastMessage;
    return {
      id: conversation._id,
      lastMessage: lastMessage
        ? {
            id: lastMessage._id,
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
          }
        : null,
      isRead: isUser1 ? conversation.isReadUser1 : conversation.isReadUser2,
      userData: otherUsersMap.get(
        isUser1 ? conversation.user2.toString() : conversation.user1.toString(),
      ),
      updatedAt: conversation.updatedAt,
    };
  });
  const nextCursor = conversationsResponse?.at(-1)?.updatedAt;
  return { conversations: conversationsResponse, nextCursor };
};
export const getMessagesService = async (
  conversationId: string,
  userId: string,
  cursor: string | undefined,
  limit: number,
) => {
  const messages = await getMessagesRepository(
    conversationId,
    userId,
    cursor,
    limit,
  );
  const messegesResponse = messages.map((message) => ({
    id: message._id,
    sender: message.sender,
    recipient: message.recipient,
    content: message.content,
    createdAt: message.createdAt,
  }));
  const nextCursor = messegesResponse?.at(-1);
  return { messages: messegesResponse, nextCursor };
};

export const addMessagesService = async (messageData: MessageDataType) => {
  const session = await mongoose.startSession();
  try {
    const message = await session.withTransaction(async () => {
      const conversation = await findConversationByUsers(
        messageData.sender,
        messageData.recipient,
        session,
      );
      if (!conversation) {
        throw new HttpError("Conversation not found", 404);
      }
      const message = await addMessagesRepository(
        messageData,
        conversation._id,
        session,
      );
      await updateLastMessage(conversation._id, message._id, session);
      await markAsUnread(
        conversation._id,
        messageData.recipient === conversation.user1.toString(),
      );
    });

    return message;
  } finally {
    await session.endSession();
  }
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

export const searchConversationService = async (
  userId: string,
  searchQuery: string,
) => {
  const users = await searchUserRepository(searchQuery);
  const usersMap = new Map();
  const userIds: string[] = [];
  users.forEach((user) => {
    userIds.push(user._id.toString());
    usersMap.set(user._id.toString(), {
      id: user._id,
      name: user.username,
      avatar: getPublicUrl(user.avatarPath),
    });
  });
  const results = await searchConversationRepository(userId, userIds);
  return results.map((result) => {
    const isUser1 = result.user1.toString() === userId;
    const lastMessage = result.lastMessage;
    return {
      id: result._id,
      lastMessage: lastMessage
        ? {
            id: lastMessage._id,
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
          }
        : null,
      isRead: isUser1 ? result.isReadUser1 : result.isReadUser2,
      userData: usersMap.get(
        isUser1 ? result.user2.toString() : result.user1.toString(),
      ),
      updatedAt: result.updatedAt,
    };
  });
};

export const searchUsersForConversationService = async (
  userId: string,
  searchQuery: string,
) => {
  const usersWithConversation = await searchUserRepository(userId);
  const usersWithConversationIds = usersWithConversation.map(
    (user) => user._id,
  );
  const users = await searchUsersForConversationRepository(
    userId,
    usersWithConversationIds,
    searchQuery,
  );
  return users.map((user) => ({
    id: user._id,
    name: user.username,
    avatar: getPublicUrl(user.avatarPath),
  }));
};
