import { Router } from "express";
import checkAuth from "../../middlewares/check-auth.js";

import { getNotifications } from "./notlification-controller.js";

const router = Router();

router.use(checkAuth);
router.get("/", getNotifications);

export default router;
