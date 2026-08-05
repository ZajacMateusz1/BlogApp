import { type ReactNode, useEffect, useRef } from "react";
import WsContext from "./ws-context";

import useAuth from "../../auth/hooks/useAuth";
import useToast from "../../shared/hooks/useToast";

import mapNotification from "../utils/map-notification";

import type { WsContextType } from "./ws-context";
import type { NotificationType } from "../types/ws-types";

interface WsContextProviderProps {
  children: ReactNode;
}

const WsContextProvider = ({ children }: WsContextProviderProps) => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}?token=${token}`);
    wsRef.current = ws;
    ws.onopen = () => {
      console.log("OK");
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "notification":
          {
            const { text, link } = mapNotification(
              message.payload as NotificationType,
            );

            addToast(text, "info", link);
          }
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
  }, [token, addToast]);
  const WsCTX: WsContextType = {
    sendMessage: () => {},
  };
  return <WsContext value={WsCTX}>{children}</WsContext>;
};

export default WsContextProvider;
