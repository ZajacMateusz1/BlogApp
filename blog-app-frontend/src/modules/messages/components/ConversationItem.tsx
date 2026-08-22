import type { ConversationDataType } from "../types/messages-types";

interface ConversationItemProps {
  conversation: ConversationDataType;
}

export default function ConversationItem({
  conversation,
}: ConversationItemProps) {
  return <div>{conversation.id}</div>;
}
