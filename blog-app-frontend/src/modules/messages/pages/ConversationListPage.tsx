import ConversationSearch from "../components/ConversationSearch";
import ConversationList from "../components/ConversationList";

export default function ConversationListPage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 p-2 md:p-4">
      <ConversationSearch />
      <ConversationList />
    </div>
  );
}
