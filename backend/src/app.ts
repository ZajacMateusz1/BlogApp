import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth-routes.js";
import usersRoutes from "./modules/users/user-routes.js";
import postsRouter from "./modules/posts/posts-routes.js";
import HttpError from "./errors/HttpError.js";
import errorHandler from "./middlewares/error-handler.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRouter);
app.use((req, res, next) => {
  next(new HttpError("Could not find that route.", 404));
});
app.use(errorHandler);
export default app;
