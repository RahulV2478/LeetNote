// src/routes/codeBlockRoutes.js
import express from "express";
import { getCodeBlocks, createCodeBlock, deleteCodeBlock } from "../controllers/codeBlockController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:documentId", authenticate, getCodeBlocks);
router.post("/:documentId", authenticate, createCodeBlock);
router.delete("/:id", authenticate, deleteCodeBlock);

export default router;
