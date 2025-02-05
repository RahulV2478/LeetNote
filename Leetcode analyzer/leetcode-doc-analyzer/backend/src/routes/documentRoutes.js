// src/routes/documentRoutes.js
import express from "express";
import { getDocuments, getDocumentById, createDocument, updateDocument, deleteDocument } from "../controllers/documentController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getDocuments);
router.get("/:id", authenticate, getDocumentById);
router.post("/", authenticate, createDocument);
router.put("/:id", authenticate, updateDocument);
router.delete("/:id", authenticate, deleteDocument);

export default router;
