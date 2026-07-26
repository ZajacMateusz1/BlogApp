import { Router } from "express";
import checkAuth from "../../middlewares/check-auth.js";
import { getFeed } from "./feed-controller.js";

const router = Router();

router.use(checkAuth);
router.get("/", getFeed);

export default router;
