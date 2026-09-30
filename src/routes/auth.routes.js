import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", authController.userRegisterController);

router.post("/login", authController.userLoginController);

export default router;
