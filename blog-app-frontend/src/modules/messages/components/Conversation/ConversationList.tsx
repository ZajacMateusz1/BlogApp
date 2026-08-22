import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { sendRequest } from "../../../../utils/http/http";
import type { getConversationsResponseType } from "../../types/messages-types";
import useAuth from "../../../auth/hooks/useAuth";
import ConversationItem from "./ConversationItem";

import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import ErrorBlock from "../../../shared/components/ErrorBlock";

interface ConversationListProps {
  handleConversationSelect: (conversationId: string) => void;
}

export default function ConversationList({
  handleConversationSelect,
}: ConversationListProps) {
  const loaderRef = useRef(null);
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
    queryKey: ["conversations"],
    queryFn: ({ pageParam, signal }) =>
      sendRequest<getConversationsResponseType>(
        `/api/messages/conversations?limit=10${pageParam ? `&cursor=${pageParam}` : ""}`,
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
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "250px",
      },
    );
    observer.observe(loaderRef.current);
    return () => {
      observer.disconnect();
    };
  }, [loaderRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error?.message}</ErrorBlock>;
  return (
    <section className="flex flex-col gap-2">
      {data?.pages.map((page) =>
        page.conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            handleConversationSelect={handleConversationSelect}
          />
        )),
      )}
      <div ref={loaderRef}></div>
    </section>
  );
}
