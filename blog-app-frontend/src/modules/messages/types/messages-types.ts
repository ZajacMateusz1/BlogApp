export type MessageDataType = {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  createdAt: string;
};

export type getMessagesResponseType = {
  messages: MessageDataType[];
  nextCursor: string | undefined;
};

export type ConversationDataType = {
  id: string;
  otherUser: {
    id: string;
    username: string;
    avatar: string;
  };
  lastMessage: string;
  updatedAt: string;
};

export type getConversationsResponseType = {
  conversations: ConversationDataType[];
  nextCursor: string | undefined;
};
