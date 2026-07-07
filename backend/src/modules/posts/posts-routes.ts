import express from "express";
import validate from "../../middlewares/validate.js";
import fileUpload from "../../middlewares/file-upload.js";
import { PostSchema, EditPostSchema, CommentSchema } from "./posts-schema.js";
import checkAuth from "../../middlewares/check-auth.js";
import {
  addPost,
  removePost,
  editPost,
  getPost,
  addLike,
  reomveLike,
  getComments,
  addComment,
} from "./posts-controller.js";

const router = express.Router();
router.use(checkAuth);
router.get("/:postId", getPost);
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

// likes

router.post("/:postId/like", addLike);
router.delete("/:postId/like", reomveLike);

// coments

router.get("/:postId/comments", getComments);
router.post("/:postId/comments", validate(CommentSchema), addComment);

export default router;
