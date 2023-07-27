import express from "express";
import asyncHandler from "express-async-handler";
import { registerUser, logIn } from "../controller/authController.js";
const router = express.Router();

router.post("/sign-in", asyncHandler(logIn));
router.post("/register", asyncHandler(registerUser));

export default router;
