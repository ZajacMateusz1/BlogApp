import { useState, type SubmitEvent, useRef, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import useWebSocket from "../../ws/hooks/useWebSocket";
import { Send } from "lucide-react";

import type {
  ConversationCacheType,
  MessagePayloadType,
} from "../types/messages-types";
import { sendRequest } from "../../../utils/http/http";
import type { getMessagesResponseType } from "../types/messages-types";
import Button from "../../shared/components/Button";
import TextAreaElement from "../../shared/components/form/TextAreaElement";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";
import MessageItem from "../components/MessageItem";

export default function ActiveConversation() {
  const { conversationId, recipientId } = useParams();
  const { token, userId } = useAuth();
  const { sendMessage } = useWebSocket();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string>("");
  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMessage(event.target.value);
  };

  const { mutate } = useMutation({
    mutationFn: () =>
      sendRequest<null>(`/api/messages/${conversationId}/read`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.setQueryData<ConversationCacheType>(
        ["conversations"],
        (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              conversations: page.conversations.map((conversation) => {
                return conversation.id === conversationId
                  ? { ...conversation, isRead: true }
                  : conversation;
              }),
            })),
          };
        },
      );
    },
  });

  const observerRef = useRef(null);
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

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(observerRef.current);
    return () => {
      observer.disconnect();
      mutate();
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, mutate]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;
    const messagePayload = {
      recipient: recipientId!,
      content: message,
    };
    sendMessage<MessagePayloadType>({
      type: "chat_message",
      payload: messagePayload,
    });
    setMessage("");
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  return (
    <section className="max-w-3xl mx-auto flex flex-col gap-4 p-2 md:p-4 bg-light">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 border-border-light border-b-2 pb-2 md:pb-4"
      >
        <TextAreaElement
          className="w-full"
          placeholder="Write your message..."
          name="message"
          value={message}
          onChange={handleMessageChange}
        >
          {""}
        </TextAreaElement>
        <Button
          className="self-end flex justify-center items-center"
          type="submit"
        >
          <Send />
          <span>Send</span>
        </Button>
      </form>
      <div className="flex flex-col justify-center gap-2 overflow-y-auto grow">
        <h2 className="text-lg font-semibold text-center md:text-xl lg:text-2xl">
          Latest Messages
        </h2>
        <ul className="flex flex-col gap-2 w-full">
          {data?.pages.map((page) =>
            page.messages.map((msg) => (
              <MessageItem
                messageData={msg}
                key={msg.id}
                isSender={msg.sender === userId}
              />
            )),
          )}
        </ul>
        <div ref={observerRef}></div>
      </div>
    </section>
  );
}
