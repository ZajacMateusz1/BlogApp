import express from "express";
import validate from "../../middlewares/validate.js";
import fileUpload from "../../middlewares/file-upload.js";
import { PostSchema, EditPostSchema } from "./posts-schema.js";
import checkAuth from "../../middlewares/check-auth.js";
import { addPost, removePost, editPost, getPost } from "./posts-controller.js";

const router = express.Router();
router.get("/:postId", getPost);
router.use(checkAuth);
router.post(
  "/create",
  fileUpload.single("image"),
  validate(PostSchema),
  addPost,
);
router.delete("/:postId", removePost);
router.patch(
  "/:postId",
  fileUpload.single("image"),
  validate(EditPostSchema),
  editPost,
);

export default router;
