import type { MessagePayloadType } from "./messages-schema.js";

export type MessageDataType = MessagePayloadType & {
  sender: string;
};
