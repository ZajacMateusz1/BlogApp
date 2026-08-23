import type { MessagePayloadType } from "./messages-schema.js";
import type { Types } from "mongoose";

export type MessageDataType = MessagePayloadType & {
  sender: string;
};

export type PopulatedConversationType = {
  _id: Types.ObjectId;
  user1: string;
  user2: string;
  lastMessage: {
    _id: Types.ObjectId;
    content: string;
    sender: string;
    createdAt: Date;
  };
  isReadUser1: boolean;
  isReadUser2: boolean;
};
