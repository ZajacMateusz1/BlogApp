import { useInfiniteQuery } from "@tanstack/react-query";
import ModalWrapper from "../../shared/components/ModalWrapper";
import { sendRequest } from "../../../utils/http/http";
interface FollowListModalProps {
  variant: "followers" | "following";
  isOpen: boolean;
  handleCloseModal: () => void;
}
export default function FollowListModal({
  variant,
  isOpen,
  handleCloseModal,
}: FollowListModalProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [],
    queryFn: () => sendRequest("", {}),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: "",
  });
  return (
    <ModalWrapper isOpen={isOpen} handleCloseModal={handleCloseModal}>
      <ul></ul>
    </ModalWrapper>
  );
}
