import express from "express";
import { register, login } from "./auth-controller";
import validate from "../../middlewares/validate";
import { LoginSchema, RegisterSchema } from "./auth-schema";
const router = express.Router();
router.post("/register", validate(RegisterSchema), register);
router.post("/login", validate(LoginSchema), login);

export default router;
