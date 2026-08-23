import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { sendRequest } from "../../../utils/http/http";
import type { getConversationsResponseType } from "../types/messages-types";
import useAuth from "../../auth/hooks/useAuth";
import ConversationItem from "./ConversationItem";

import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";

export default function ConversationList() {
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
  if (data?.pages[0].conversations.length === 0)
    return <div>No conversations found</div>;
  return (
    <section className="flex flex-col gap-2 bg-light rounded-xl p-2 md:p-4">
      <h1 className="text-xl font-bold text-primary capitalize text-center md:text-2xl lg:text-3xl mb-2 md:mb-4 lg:mb-6">
        Your latest conversations
      </h1>
      {data?.pages.map((page) =>
        page.conversations.map((conversation) => (
          <ConversationItem key={conversation.id} conversation={conversation} />
        )),
      )}
      <div ref={loaderRef}></div>
    </section>
  );
}
