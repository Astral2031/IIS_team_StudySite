import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createComment, getCommentsByPost, updateComment, deleteComment } from "../controllers/commentsController.js";

const router = express.Router();

router.post("/:category/:postId/comments", authMiddleware, createComment);
router.get("/:category/:postId/comments", getCommentsByPost);
router.put("/:category/:postId/comments/:commentId", authMiddleware, updateComment);
router.delete("/:category/:postId/comments/:commentId", authMiddleware, deleteComment);

export default router;
