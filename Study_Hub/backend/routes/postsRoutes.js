import express from "express";
import { createPost, getPosts, increaseViews, getPostById, getPopularPosts, deletePost, updatePost, toggleLike, getMyAllPosts, getMyAllComments } from "../controllers/postsController.js";
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
router.get("/myposts/all/:userId", authMiddleware, getMyAllPosts);
router.get('/mycomments/all/:userId', authMiddleware, getMyAllComments);



export default router;
