import type { IncomingMessage, Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { verifyToken } from "../utils/verify-token";

import type { WsMessageType } from "./ws-types";

export const startWebSocketServer = (server: Server) => {
  const connections: Map<string, Set<WebSocket>> = new Map();
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024 * 10,
  });
  wss.on("connection", (socket: WebSocket, request: IncomingMessage) => {
    const url = new URL(request.url!, "http://localhost");
    const token = url.searchParams.get("token");
    if (!token) {
      socket.close(1008, "Authentication required");
      return;
    }
    try {
      const { userId } = verifyToken(token);
      console.log("Connected");
      let sockets = connections.get(userId);
      if (!sockets) {
        sockets = new Set<WebSocket>();
        connections.set(userId, sockets);
      }
      sockets.add(socket);
      socket.on("error", (error: Error) => {
        console.error(error);
      });
      socket.on("close", () => {
        const sockets = connections.get(userId);
        if (!sockets) return;
        sockets.delete(socket);
        if (sockets.size === 0) connections.delete(userId);
        console.log("Disconnected");
      });
      socket.on("message", (data) => {
        console.log(data);
      });
    } catch (error) {
      socket.close(1008, "Authentication required");
      return;
    }
  });
};
