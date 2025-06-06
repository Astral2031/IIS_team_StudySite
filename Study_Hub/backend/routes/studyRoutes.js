import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createStudy, getStudies, deleteStudy, applyToStudy, getStudyById, getMyHostedStudyApplicants, getHostedStudies, updateApplicationStatus, getMyStudies } from "../controllers/studyController.js";

const router = express.Router();

router.post("/", createStudy);
router.get("/", getStudies);
router.get("/hosted", authMiddleware, getHostedStudies);
router.get("/my", authMiddleware, getMyStudies);
router.delete("/:id", deleteStudy);
router.post("/:id/apply", applyToStudy);
router.get("/:id", getStudyById);
router.get("/:id/applicants", authMiddleware, getMyHostedStudyApplicants);
router.patch("/:id/status", authMiddleware, updateApplicationStatus);





export default router;
