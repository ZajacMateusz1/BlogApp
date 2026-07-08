import express from "express";
import checkAuth from "../../middlewares/check-auth.js";
import fileUpload from "../../middlewares/file-upload.js";
import validate from "../../middlewares/validate.js";
import {
  getUsers,
  getUser,
  editUser,
  getUserPosts,
  followUser,
  unfollowUser,
} from "./user-controller.js";
import { EditUserSchema } from "./user-schema.js";

const router = express.Router();
router.get("/", getUsers);
router.get("/:userId", getUser);
router.get("/:userId/posts", getUserPosts);
router.use(checkAuth);
router.patch(
  "/me",
  fileUpload.single("avatar"),
  validate(EditUserSchema),
  editUser,
);
router.post("/:followingId/follow", followUser);
router.delete("/:followingId/follow", unfollowUser);

export default router;
