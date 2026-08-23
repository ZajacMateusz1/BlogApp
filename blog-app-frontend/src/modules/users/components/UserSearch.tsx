import { useEffect, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../auth/hooks/useAuth";

import { sendRequest } from "../../../utils/http/http";

import SearchBar from "../../shared/components/SearchBar";
import UserSearchCard from "./UserSearchCard";
import ErrorBlock from "../../shared/components/ErrorBlock";
import LoadingSpinner from "../../shared/components/LoadingSpinner";

import type { BaseUserResponseType } from "../types/users-types";

interface UserSearchProps {
  link: string;
  notFoundText: string;
  queryKey: string;
  headerText: string;
  cardIsLink?: boolean;
  disableButton?: boolean;
  onClick?: (param?: string) => void;
}

export default function UserSearch({
  link,
  notFoundText,
  queryKey,
  headerText,
  cardIsLink = true,
  disableButton = false,
  onClick,
}: UserSearchProps) {
  const { token } = useAuth();
  const [query, setQuery] = useState<string>("");
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [queryKey, query],
    queryFn: ({ signal }) =>
      sendRequest<BaseUserResponseType[]>(
        `${link}?search=${encodeURIComponent(query)}`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
  }, [query, refetch]);
  return (
    <section className="bg-light relative p-3 md:p-4 rounded-xl w-full">
      <SearchBar id="search-user" value={query} onChange={handleQueryChange}>
        {headerText}
      </SearchBar>
      <div className="absolut left-0 bottom-0 p-3 md:p-4">
        {isError && <ErrorBlock>{error.message}</ErrorBlock>}
        {isLoading && <LoadingSpinner fullScreen={false} />}
        {!isLoading && !isError && data?.length == 0 && query.length > 2 && (
          <p>{notFoundText}</p>
        )}
        {data &&
          data.length > 0 &&
          data.map((userData) => (
            <UserSearchCard
              onClick={onClick}
              key={userData.id}
              userData={userData}
              isLoading={disableButton}
              isLink={cardIsLink}
            />
          ))}
      </div>
    </section>
  );
}
