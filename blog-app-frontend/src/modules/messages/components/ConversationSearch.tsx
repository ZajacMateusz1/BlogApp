import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../auth/hooks/useAuth";

import { sendRequest } from "../../../utils/http/http";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";

import type { ConversationResponseType } from "../types/messages-types";

import SearchBar from "../../shared/components/SearchBar";
import ConversationItem from "../components/ConversationItem";

export default function ConversationSearch() {
  const { token } = useAuth();
  const [query, setQuery] = useState<string>("");
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const { refetch, data, isLoading, isError, error } = useQuery({
    queryKey: ["conversations-search"],
    queryFn: ({ signal }) =>
      sendRequest<ConversationResponseType[]>(
        `/api/messages/search?search=${encodeURIComponent(query)}`,
        {
          signal,
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    enabled: false,
  });
  useEffect(() => {
    if (query.length < 2) return;
    const timeout = setTimeout(() => {
      refetch();
    }, 500);
    return () => clearTimeout(timeout);
  }, [refetch, query]);
  return (
    <section className="bg-light relative p-3 md:p-4 rounded-xl">
      <SearchBar
        id="search-conversations"
        onChange={handleQueryChange}
        value={query}
      >
        Search Conversations
      </SearchBar>
      <div className="absolut left-0 bottom-0 p-3 md:p-4">
        {isError && <ErrorBlock>{error.message}</ErrorBlock>}
        {isLoading && <LoadingSpinner fullScreen={false} />}
        {!isLoading && !isError && data?.length == 0 && query.length > 2 && (
          <p>No conversations found.</p>
        )}
        {data &&
          query.length > 2 &&
          data.map((conversationData) => {
            return (
              <ConversationItem
                key={conversationData.id}
                conversation={conversationData}
              />
            );
          })}
      </div>
    </section>
  );
}
