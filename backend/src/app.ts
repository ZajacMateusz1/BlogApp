import express from "express";
import authRoutes from "./modules/auth/auth-routes";
import usersRoutes from "./modules/users/user-routes";
import HttpError from "./errors/HttpError";
import errorHandler from "./middlewares/error-handler";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT",
  );
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use((req, res, next) => {
  next(new HttpError("Could not find that route.", 404));
});
app.use(errorHandler);
export default app;
