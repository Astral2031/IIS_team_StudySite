import express from "express";
import { createPost, getPosts, increaseViews, getPostById, getPopularPosts, deletePost, updatePost, toggleLike } from "../controllers/postsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createComment } from "../controllers/commentsController.js";



const router = express.Router();

router.post("/create/:category", createPost);
router.get('/popular', getPopularPosts);
router.get("/:category", getPosts);
router.post("/:category/:postId/increase-views", increaseViews);
router.get("/:category/:postId", getPostById);
router.delete("/:category/:postId", deletePost);
router.put("/:category/:postId", updatePost);
router.post("/:category/:postId/like", authMiddleware, toggleLike);
router.post('/:category/:postId/comments', authMiddleware, createComment);


export default router;
