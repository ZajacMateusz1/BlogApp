import { useState } from "react";
import ConversationSearch from "../components/ConversationSearch";
import ConversationList from "../components/ConversationList";
import NewConversationModal from "../components/NewConversationModal";

export default function ConversationListPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 p-2 md:p-4">
      <ConversationSearch />
      <ConversationList handleOpenModal={handleOpenModal} />
      {modalOpen && (
        <NewConversationModal handleCloseModal={handleCloseModal} />
      )}
    </div>
  );
}
