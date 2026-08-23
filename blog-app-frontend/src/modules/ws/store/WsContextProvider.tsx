import { type ReactNode, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import WsContext from "./ws-context";

import useAuth from "../../auth/hooks/useAuth";
import useToast from "../../shared/hooks/useToast";

import mapNotification from "../../notifications/utils/map-notification";

import type { WsContextType } from "./ws-context";
import type {
  WSNotificationType,
  NotificationCacheType,
} from "../../notifications/types/notifications-types";
import type { WsMessageType } from "../types/ws-types";

interface WsContextProviderProps {
  children: ReactNode;
}

const WsContextProvider = ({ children }: WsContextProviderProps) => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  const sendMessage = <T,>(message: WsMessageType<T>) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not open");
      return;
    }
    wsRef.current.send(JSON.stringify(message));
  };

  const WS_TIMEOUT = 5000; // 5 seconds
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let shouldReconnect = true;
    const initWebSocket = () => {
      const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?token=${token}`);
      wsRef.current = ws;
      ws.onopen = () => {
        console.log("WebSocket connection established");
      };
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          switch (message.type) {
            case "notification":
              {
                const { text, link } = mapNotification(
                  message.payload as WSNotificationType,
                );
                queryClient.setQueryData<NotificationCacheType>(
                  ["notifications"],
                  (oldData) => {
                    if (!oldData) return;
                    return {
                      ...oldData,
                      pages: oldData.pages.map((page, index) => {
                        return index === 0
                          ? {
                              ...page,
                              notifications: [
                                message.payload,
                                ...page.notifications,
                              ],
                            }
                          : page;
                      }),
                    };
                  },
                );
                addToast(text, "info", link);
              }
              break;
            case "chat_message": {
              break;
            }
            case "error":
              console.log("Error message received:", message.payload.error);
              break;
            default:
              console.log("Unknown message type:", message.type);
              console.log("Message payload:", message.payload);
              break;
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
        timer = setTimeout(() => {
          if (shouldReconnect) {
            initWebSocket();
          }
        }, WS_TIMEOUT);
      };
      return ws;
    };

    const ws = initWebSocket();
    return () => {
      shouldReconnect = false;
      ws.close();
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [token, queryClient, addToast]);
  const WsCTX: WsContextType = {
    sendMessage: sendMessage,
  };
  return <WsContext value={WsCTX}>{children}</WsContext>;
};

export default WsContextProvider;
