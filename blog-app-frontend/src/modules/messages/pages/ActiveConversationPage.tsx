import { useState, type SubmitEvent, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import useWebSocket from "../../ws/hooks/useWebSocket";
import { Send } from "lucide-react";

import type { MessagePayloadType } from "../types/messages-types";
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
  const [message, setMessage] = useState<string>("");
  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMessage(event.target.value);
  };

  const observerRef = useRef(null);
  const {
    data,
    isLoading,
    isError,
    error,
    hasPreviousPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
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
    getNextPageParam: () => undefined,
    getPreviousPageParam: (firstPage) => firstPage.nextCursor,
  });

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasPreviousPage &&
        !isFetchingPreviousPage
      ) {
        fetchPreviousPage();
      }
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasPreviousPage, fetchPreviousPage, isFetchingPreviousPage]);

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

  if (isLoading) <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  return (
    <section className="max-w-3xl mx-auto flex flex-col gap-4 p-2 md:p-4 bg-light">
      <div className="flex items-center gap-2 overflow-y-auto grow">
        <div ref={observerRef}></div>
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
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
    </section>
  );
}
