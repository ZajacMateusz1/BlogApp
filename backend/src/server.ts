import { createServer } from "http";
import mongoose from "mongoose";
import app from "./app.js";
import env from "./config/env.js";
import { startWebSocketServer } from "./modules/ws/ws.js";

const start = async () => {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("Conntected to database");
    const server = createServer(app);
    startWebSocketServer(server);
    server.listen(env.PORT, () => {
      console.log(`Server running on port: ${env.PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
