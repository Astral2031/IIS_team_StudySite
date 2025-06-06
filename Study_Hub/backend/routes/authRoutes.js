import express from "express";
import { register, login, changePassword, deleteAccount, getProfile, updateProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register, authMiddleware);
router.post("/login", login, authMiddleware);
router.patch("/change-password", authMiddleware, changePassword);
router.delete("/delete", authMiddleware, deleteAccount);
router.get("/profile", authMiddleware, getProfile);
router.patch("/profile-update", authMiddleware, updateProfile);


export default router;
