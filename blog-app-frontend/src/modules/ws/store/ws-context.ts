import { createContext } from "react";

export interface WsContextType {
  sendMessage: () => void;
}

const WsContext = createContext<WsContextType | null>(null);

export default WsContext;
