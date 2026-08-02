import type { IncomingMessage, Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import type { TokenPayload } from "../types/token/jwt-payload-type";

import type { WsMessageType } from "./ws-types";

export const startWebSocketServer = (server: Server) => {
  const connections: Map<string, WebSocket> = new Map();
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
      const decodedToken = jwt.verify(token, env.JWT_SECRET);
      const { userId } = decodedToken as TokenPayload;
      console.log("Connected");
      if (!connections.has(userId)) connections.set(userId, socket);
      socket.on("error", (error: Error) => {
        console.error(error);
      });
      socket.on("close", () => {
        connections.delete(userId);
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
