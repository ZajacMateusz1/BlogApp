import express from "express";
import validate from "../../middlewares/validate";
import { PostSchema } from "./posts-schema";
import checkAuth from "../../middlewares/check-auth";
import { addPost } from "./posts-controller";
const router = express.Router();
router.use(checkAuth);
router.post("/create-post", validate(PostSchema), addPost);
export default router;
