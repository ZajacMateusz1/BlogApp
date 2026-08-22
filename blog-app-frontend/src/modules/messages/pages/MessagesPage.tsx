import { useState } from "react";
import ConversationList from "../components/Conversation/ConversationList";
import ActiveConversation from "../components/Conversation/ActiveConversation";

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };
  if (selectedConversationId == null) {
    return (
      <ConversationList handleConversationSelect={handleConversationSelect} />
    );
  }
  return <ActiveConversation conversationId={selectedConversationId} />;
}
