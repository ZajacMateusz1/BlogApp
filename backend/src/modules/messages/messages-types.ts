import type { MessagePayloadType } from "./messages-schema.js";
import type { Types } from "mongoose";

export type MessageDataType = MessagePayloadType & {
  sender: string;
};

export type PopulatedConversationType = {
  _id: Types.ObjectId;
  user1: Types.ObjectId;
  user2: Types.ObjectId;
  lastMessage: {
    _id: Types.ObjectId;
    content: string;
    sender: string;
    createdAt: string;
  };
  isReadUser1: boolean;
  isReadUser2: boolean;
  updatedAt: string;
};
