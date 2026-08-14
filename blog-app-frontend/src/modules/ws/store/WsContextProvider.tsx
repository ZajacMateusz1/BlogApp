import { type ReactNode, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import WsContext from "./ws-context";

import useAuth from "../../auth/hooks/useAuth";
import useToast from "../../shared/hooks/useToast";

import mapNotification from "../../notifications/utils/map-notification";

import type { WsContextType } from "./ws-context";
import type { WSNotificationType } from "../../notifications/types/notifications-types";

interface WsContextProviderProps {
  children: ReactNode;
}

const WsContextProvider = ({ children }: WsContextProviderProps) => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?token=${token}`);
    ws.onopen = () => {
      console.log("OK");
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "notification":
          {
            const { text, link } = mapNotification(
              message.payload as WSNotificationType,
            );
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            addToast(text, "info", link);
          }
          break;
        case "error":
          console.log("Error message received:", message.payload.error);
          break;
        default:
          console.log("Unknown message type:", message.type);
          console.log("Message payload:", message.payload);
          break;
      }
    };
    ws.onclose = () => {
      console.log("Closed");
    };
    return () => ws.close();
  }, [token, addToast, queryClient]);
  const WsCTX: WsContextType = {
    sendMessage: () => {},
  };
  return <WsContext value={WsCTX}>{children}</WsContext>;
};

export default WsContextProvider;
