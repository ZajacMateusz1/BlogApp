import { Link } from "react-router-dom";
import type { ConversationDataType } from "../types/messages-types";

interface ConversationItemProps {
  conversation: ConversationDataType;
}

export default function ConversationItem({
  conversation,
}: ConversationItemProps) {
  return (
    <Link to={`/conversations/${conversation.id}`}>
      <div>{conversation.id}</div>
    </Link>
  );
}
