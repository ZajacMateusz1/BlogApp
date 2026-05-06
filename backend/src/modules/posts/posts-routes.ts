import express from "express";
import validate from "../../middlewares/validate";
import { PostSchema } from "./posts-schema";
import checkAuth from "../../middlewares/check-auth";
import { addPost, removePost } from "./posts-controller";

const router = express.Router();
router.use(checkAuth);
router.post("/create-post", validate(PostSchema), addPost);
router.delete("/delete/:postId", removePost);

export default router;
