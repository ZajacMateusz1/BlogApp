import { Router } from "express";
import checkAuth from "../../middlewares/check-auth.js";

import { getNotifications, markAsRead } from "./notification-controller.js";

const router = Router();

router.use(checkAuth);
router.get("/", getNotifications);
router.patch("/read", markAsRead);

export default router;
