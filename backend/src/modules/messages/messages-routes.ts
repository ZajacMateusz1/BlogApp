import { Router } from "express";
import checkAuth from "../../middlewares/check-auth.js";
import { markAsRead } from "./messages-controller.js";

const router = Router();
router.use(checkAuth);

router.patch("/:conversationId/read", markAsRead);

export default router;
