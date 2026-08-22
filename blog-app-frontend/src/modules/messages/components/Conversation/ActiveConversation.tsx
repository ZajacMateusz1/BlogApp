import { useInfiniteQuery } from "@tanstack/react-query";

import useAuth from "../../../auth/hooks/useAuth";
import { sendRequest } from "../../../../utils/http/http";
import type { getMessagesResponseType } from "../../types/messages-types";

interface ActiveConversationProps {
  conversationId: string;
}
export default function ActiveConversation({
  conversationId,
}: ActiveConversationProps) {
  const { token } = useAuth();
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["conversation", conversationId],
    queryFn: ({ pageParam, signal }) =>
      sendRequest<getMessagesResponseType>(
        `/api/messages/${conversationId}/messages?limit=10${pageParam ? `&cursor=${pageParam}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        },
      ),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  return <section></section>;
}
