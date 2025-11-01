import express from "express";
import { adminSignUp, adminLogin } from "../controllers/admin/authController.js";
import { userSignup, userLogin } from "../controllers/user/authController.js";

const router = express.Router();

// Admin routes
router.post("/admin-signup", adminSignUp);
router.post("/admin-login", adminLogin);

// User routes
router.post("/user-signup", userSignup);
router.post("/user-login", userLogin);

export default router;
