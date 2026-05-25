import express from "express";
import { register, login } from "./auth-controller.js";
import validate from "../../middlewares/validate.js";
import { LoginSchema, RegisterSchema } from "./auth-schema.js";
const router = express.Router();
router.post("/register", validate(RegisterSchema), register);
router.post("/login", validate(LoginSchema), login);

export default router;
