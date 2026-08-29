import type { MessageDataType } from "../types/messages-types";

interface MessageItemProps {
  messageData: MessageDataType;
  isSender: boolean;
}

export default function MessageItem({
  messageData,
  isSender,
}: MessageItemProps) {
  console.log(isSender);
  return <li>{messageData.content}</li>;
}
