import { createContext } from "react";
import type { WsMessageType } from "../types/ws-types";

export interface WsContextType {
  sendMessage: <T>(message: WsMessageType<T>) => void;
}

const WsContext = createContext<WsContextType | null>(null);

export default WsContext;
