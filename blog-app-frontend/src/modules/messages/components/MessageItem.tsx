import type { MessageDataType } from "../types/messages-types";

interface MessageItemProps {
  messageData: MessageDataType;
  isSender: boolean;
}

export default function MessageItem({
  messageData,
  isSender,
}: MessageItemProps) {
  let styles =
    "px-4 py-2 rounded-lg max-w-[70%] break-all text-xs md:text-sm lg:text-base";
  if (isSender) {
    styles += " bg-primary text-white self-end";
  } else {
    styles += " bg-gray-200 text-gray-800 self-start";
  }
  return <li className={styles}>{messageData.content}</li>;
}
