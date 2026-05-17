import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth-routes";
import usersRoutes from "./modules/users/user-routes";
import postsRouter from "./modules/posts/posts-routes";
import HttpError from "./errors/HttpError";
import errorHandler from "./middlewares/error-handler";

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
