import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth-routes.js";
import usersRoutes from "./modules/users/user-routes.js";
import postsRouter from "./modules/posts/posts-routes.js";
import feedRouter from "./modules/feed/feed-routes.js";
import notificationRouter from "./modules/notifications/notification-routes.js";
import messagesRouter from "./modules/messages/messages-routes.js";
import HttpError from "./errors/HttpError.js";
import errorHandler from "./middlewares/error-handler.js";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const app = express();
app.set("trust proxy", 1);
app.use(limiter);
app.use(express.json());
app.use(cors());
app.use("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRouter);
app.use("/api/feed", feedRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/messages", messagesRouter);
app.use((req, res, next) => {
  next(new HttpError("Could not find that route.", 404));
});
app.use(errorHandler);
export default app;
