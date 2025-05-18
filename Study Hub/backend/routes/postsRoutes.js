import express from "express";
import { createPost, getPosts, increaseViews, getPostById, getPopularPosts, deletePost } from "../controllers/postsController.js";



const router = express.Router();

router.post("/create/:category", createPost);
router.get('/popular', getPopularPosts);
router.get("/:category", getPosts);
router.post("/:category/:postId/increase-views", increaseViews);
router.get("/:category/:postId", getPostById);
router.delete("/:category/:postId", deletePost);

export default router;
