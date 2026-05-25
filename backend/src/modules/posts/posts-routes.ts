import express from "express";
import validate from "../../middlewares/validate.js";
import { PostSchema, EditPostSchema } from "./posts-schema.js";
import checkAuth from "../../middlewares/check-auth.js";
import { addPost, removePost, editPost, getPost } from "./posts-controller.js";

const router = express.Router();
router.get("/:postId", getPost);
router.use(checkAuth);
router.post("/create-post", validate(PostSchema), addPost);
router.delete("/delete/:postId", removePost);
router.patch("/edit/:postId", validate(EditPostSchema), editPost);

export default router;
