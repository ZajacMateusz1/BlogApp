import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAuth from "../../auth/hooks/useAuth";

import ModalWrapper from "../../shared/components/ModalWrapper";
import { sendRequest } from "../../../utils/http/http";

import type { getFollowListResponseType } from "../types/users-types";

import UserSearchCard from "./UserSearchCard";

interface FollowListModalProps {
  modalType: "followers" | "following";
  userId: string | undefined;
  handleCloseModal: () => void;
}
export default function FollowListModal({
  modalType,
  userId,
  handleCloseModal,
}: FollowListModalProps) {
  const { token } = useAuth();
  const loaderRef = useRef(null);
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["followsList", userId, modalType],
    queryFn: ({ signal, pageParam }) =>
      sendRequest<getFollowListResponseType>(
        `/api/users/${userId}/${modalType}?limit=10${pageParam ? `&cursor=${pageParam}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        },
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: "",
  });
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingNextPage && hasNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);
  return (
    <ModalWrapper
      handleCloseModal={handleCloseModal}
      isLoading={isLoading}
      error={error?.message}
    >
      <ul>
        {data?.pages.map(({ users }) =>
          users.map((user) => (
            <li key={user.id}>
              <UserSearchCard userData={user} onClick={handleCloseModal} />
            </li>
          )),
        )}
      </ul>
      <div ref={loaderRef}></div>
    </ModalWrapper>
  );
}
