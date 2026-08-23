import { useContext } from "react";
import WsContext from "../store/ws-context";

export default function useWebSocket() {
  const wsContext = useContext(WsContext);
  if (!wsContext) {
    throw new Error("Use that hook in WsContextProvider children");
  }
  return wsContext;
}
