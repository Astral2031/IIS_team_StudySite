import express from "express";
import { createStudy } from "../controllers/studyController.js";

const router = express.Router();

router.post("/createStudy", createStudy);

export default router;
