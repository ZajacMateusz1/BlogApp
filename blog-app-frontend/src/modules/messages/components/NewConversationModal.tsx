import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../auth/hooks/useAuth";
import useToast from "../../shared/hooks/useToast";

import { sendRequest } from "../../../utils/http/http";

import ModalWrapper from "../../shared/components/ModalWrapper";
import UserSearch from "../../users/components/UserSearch";

interface NewConversationModalProps {
  handleCloseModal: () => void;
}

export default function NewConversationModal({
  handleCloseModal,
}: NewConversationModalProps) {
  const { token } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (userId: string) =>
      sendRequest(`/api/messages/conversation/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      addToast("Conversation created successfully!", "success");
      handleCloseModal();
    },
    onError: (error) => {
      addToast(error.message, "error");
    },
  });
  return (
    <ModalWrapper handleCloseModal={handleCloseModal}>
      <UserSearch
        link="/api/messages/search/users"
        notFoundText="Can't find any users to start a conversation with."
        queryKey="new-conversation-search"
        headerText="Start a new conversation"
        cardIsLink={false}
        disableButton={isPending}
        onClick={(userId: string | undefined) => {
          if (!userId) return;
          mutate(userId);
        }}
      />
    </ModalWrapper>
  );
}
