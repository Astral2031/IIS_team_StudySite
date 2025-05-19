import express from "express";
import { register, login, changePassword, deleteAccount } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/change-password", authMiddleware, changePassword);
router.delete("/delete", authMiddleware, deleteAccount);

export default router;
