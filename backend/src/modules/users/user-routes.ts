import express from "express";
import checkAuth from "../../middlewares/check-auth.js";
import fileUpload from "../../middlewares/file-upload.js";
import validate from "../../middlewares/validate.js";
import { getUsers, getUser, editUser } from "./user-controller.js";
import { EditPostSchema } from "../posts/posts-schema.js";

const router = express.Router();
router.get("/", getUsers);
router.get("/:userId", getUser);
router.use(checkAuth);
router.patch(
  "/:userId",
  fileUpload.single("avatar"),
  validate(EditPostSchema),
  editUser,
);

export default router;
