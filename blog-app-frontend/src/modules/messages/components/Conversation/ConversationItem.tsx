import type { ConversationDataType } from "../../types/messages-types";
interface ConversationItemProps {
  conversation: ConversationDataType;
  handleConversationSelect: (conversationId: string) => void;
}
export default function ConversationItem({
  conversation,
  handleConversationSelect,
}: ConversationItemProps) {
  return (
    <div onClick={() => handleConversationSelect(conversation.id)}>
      {conversation.id}
    </div>
  );
}
