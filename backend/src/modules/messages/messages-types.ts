import type { MessagePayloadType } from "./messages-schema.js";

export type MassageDataType = MessagePayloadType & {
  sender: string;
};
