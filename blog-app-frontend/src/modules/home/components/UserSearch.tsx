import { useEffect, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../auth/hooks/useAuth";

import { sendRequest } from "../../../utils/http/http";

import SearchBar from "../../shared/components/SearchBar";
import UserSearchCard from "../../users/components/UserSearchCard";
import ErrorBlock from "../../shared/components/ErrorBlock";
import LoadingSpinner from "../../shared/components/LoadingSpinner";

import type { BaseUserResponseType } from "../../users/types/users-types";

export default function UserSearch() {
  const { token } = useAuth();
  const [query, setQuery] = useState<string>("");
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user-search", query],
    queryFn: ({ signal }) =>
      sendRequest<BaseUserResponseType[]>(
        `/api/users/search?search=${encodeURIComponent(query)}`,
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
    <section className="bg-light relative p-3 md:p-4 rounded-xl">
      <SearchBar id="search-user" value={query} onChange={handleQueryChange}>
        Search user
      </SearchBar>
      <div className="absolut left-0 bottom-0 p-3 md:p-4">
        {isError && <ErrorBlock>{error.message}</ErrorBlock>}
        {isLoading && <LoadingSpinner fullScreen={false} />}
        {!isLoading && !isError && data?.length == 0 && query.length > 2 && (
          <p>No users found.</p>
        )}
        {data &&
          data.length > 0 &&
          data.map((userData) => (
            <UserSearchCard key={userData.id} userData={userData} />
          ))}
      </div>
    </section>
  );
}
