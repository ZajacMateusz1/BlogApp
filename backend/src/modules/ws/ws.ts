import type { IncomingMessage, Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { verifyToken } from "../../utils/verify-token.js";
import { messageSchema } from "../messages/messages-schema.js";
import { addMessagesService } from "../messages/messages-service.js";

import type { WsMessageType } from "./ws-types";
import type { Duplex } from "stream";

const HEARTBEAT_INTERVAL = 30000; // 30 seconds

const connections: Map<string, Set<WebSocket>> = new Map();
export const startWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({
    noServer: true,
    maxPayload: 1024 * 1024 * 10,
  });

  server.on(
    "upgrade",
    (request: IncomingMessage, socket: Duplex, head: Buffer) => {
      const url = new URL(request.url!, "http://localhost");
      if (url.pathname !== "/ws") {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        socket.destroy();
        return;
      }
      const token = url.searchParams.get("token");
      if (!token) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }
      try {
        const { userId } = verifyToken(token);
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request, userId);
        });
      } catch (error) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }
    },
  );

  // ping/pong

  const interval = setInterval(() => {
    for (const sockets of connections.values()) {
      for (const s of sockets) {
        if (s.isAlive === false) {
          s.terminate();
          continue;
        }
        s.isAlive = false;
        s.ping();
      }
    }
  }, HEARTBEAT_INTERVAL);

  wss.on(
    "connection",
    (socket: WebSocket, request: IncomingMessage, userId: string) => {
      socket.isAlive = true;
      let sockets = connections.get(userId);
      if (!sockets) {
        sockets = new Set<WebSocket>();
        connections.set(userId, sockets);
      }
      sockets.add(socket);
      socket.on("error", (error: Error) => {
        console.error(error);
      });
      socket.on("message", async (data) => {
        try {
          const message = JSON.parse(data.toString());
          switch (message.type) {
            case "chat_message": {
              const result = messageSchema.parse(message);
              await addMessagesService({ ...result.payload, sender: userId });
              sendMessage(result.payload.recipient, {
                type: "chat_message",
                payload: { content: result.payload.content, sender: userId },
              });
              break;
            }
            default: {
              console.log("Unknown message type:", message.type);
              console.log("Message payload:", message.payload);
            }
          }
        } catch (error) {
          socket.send(
            JSON.stringify({
              type: "error",
              payload: { error: "Invalid message or conversation don't exist" },
            }),
          );
          console.error(error);
        }
      });

      socket.on("pong", () => {
        socket.isAlive = true;
      });

      socket.on("close", () => {
        const sockets = connections.get(userId);
        if (!sockets) return;
        sockets.delete(socket);
        if (sockets.size === 0) connections.delete(userId);
      });
    },
  );

  wss.on("close", () => {
    clearInterval(interval);
  });
};

// messages

export function sendMessage<T>(targetId: string, message: WsMessageType<T>) {
  try {
    const serializedMessage = JSON.stringify(message);
    const sockets = connections.get(targetId);
    if (!sockets) return;
    for (const s of sockets) {
      if (s.readyState === WebSocket.OPEN) {
        s.send(serializedMessage);
      }
    }
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

export function broadcastMessage<T>(message: WsMessageType<T>) {
  try {
    const serializedMessage = JSON.stringify(message);
    for (const sockets of connections.values()) {
      for (const s of sockets) {
        if (s.readyState === WebSocket.OPEN) {
          s.send(serializedMessage);
        }
      }
    }
  } catch (error) {
    console.error("Failed to broadcast message:", error);
  }
}
