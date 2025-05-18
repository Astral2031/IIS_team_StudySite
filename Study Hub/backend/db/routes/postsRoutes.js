import express from "express";
import { createPost } from "../controllers/postsController.js";
import { getPosts } from "../controllers/postsController.js";
import { increaseViews } from "../controllers/postsController.js";
import { getPostById } from "../controllers/postsController.js";

const router = express.Router();

router.post("/create/:category", createPost);
router.get("/:category", getPosts);
router.post("/:category/:postId/increase-views", increaseViews);
router.get("/:category/:postId", getPostById);

export default router;
