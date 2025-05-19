import express from "express";
import { createStudy, getStudies, deleteStudy } from "../controllers/studyController.js";

const router = express.Router();

router.post("/", createStudy);
router.get("/", getStudies);
router.delete("/:id", deleteStudy);

export default router;
