import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateComment, deleteComment } from "../controllers/commentsController.js";

const router = express.Router();

router.put("/:category/:postId/comments/:commentId", authMiddleware, updateComment);
router.delete("/:category/:postId/comments/:commentId", authMiddleware, deleteComment);

export default router;
