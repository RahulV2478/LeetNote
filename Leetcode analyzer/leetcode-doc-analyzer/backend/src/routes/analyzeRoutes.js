// src/routes/analyzeRoutes.js
import express from "express";
import { analyzeCode, generateHint } from "../controllers/analyzeController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze-code", authenticate, analyzeCode);
router.post("/generate-hint", authenticate, generateHint);

export default router;
