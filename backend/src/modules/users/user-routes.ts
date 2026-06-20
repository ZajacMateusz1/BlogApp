import express from "express";
import checkAuth from "../../middlewares/check-auth.js";
import fileUpload from "../../middlewares/file-upload.js";
import validate from "../../middlewares/validate.js";
import { getUsers, getUser, editUser } from "./user-controller.js";
import { EditUserSchema } from "./user-schema.js";

const router = express.Router();
router.get("/", getUsers);
router.get("/:userId", getUser);
router.use(checkAuth);
router.patch(
  "/me",
  fileUpload.single("avatar"),
  validate(EditUserSchema),
  editUser,
);

export default router;
