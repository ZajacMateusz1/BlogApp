import { Router } from "express";
import checkAuth from "../../middlewares/check-auth.js";
import {
  markAsRead,
  addConversation,
  getConversations,
  getMessages,
  searchConversation,
  searchUsersForConversation,
} from "./messages-controller.js";

const router = Router();
router.use(checkAuth);

router.post("/conversation/:userId", addConversation);
router.patch("/:conversationId/read", markAsRead);
router.get("/conversations", getConversations);
router.get("/:conversationId/messages", getMessages);
router.get("/search", searchConversation);
router.get("/search/users", searchUsersForConversation);

export default router;
