import { Router } from "express";
import checkAuth from "../../middlewares/check-auth.js";
import {
  markAsRead,
  addConversation,
  getConversations,
  getMessages,
} from "./messages-controller.js";

const router = Router();
router.use(checkAuth);

router.post("/conversation", addConversation);
router.patch("/:conversationId/read", markAsRead);
router.get("/conversations", getConversations);
router.get("/:conversationId/messages", getMessages);

export default router;
