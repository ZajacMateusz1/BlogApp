export type MessageDataType = {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  createdAt: string;
};

export type ConversationResponseType = {
  id: string;
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
  };
  isRead: boolean;
  userData: {
    id: string;
    username: string;
    avatar: string;
  };
};

export type getMessagesResponseType = {
  messages: MessageDataType[];
  nextCursor: string | undefined;
};

export type getConversationsResponseType = {
  conversations: ConversationResponseType[];
  nextCursor: string | undefined;
};

export type MessagePayloadType = {
  recipient: string;
  content: string;
};
