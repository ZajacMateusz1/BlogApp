import express from "express";
import HttpError from "./errors/HttpError.js";
import errorHandler from "./middlewares/error-handler.js";

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
app.use((req, res, next) => {
  next(new HttpError("Could not find that route.", 404));
});
app.use(errorHandler);
export default app;
