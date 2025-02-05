// src/app.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import codeBlockRoutes from "./routes/codeBlockRoutes.js";
import analyzeRoutes from "./routes/analyzeRoutes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Mount routes under specific paths
app.use("/auth", authRoutes);
app.use("/documents", documentRoutes);
app.use("/codeblocks", codeBlockRoutes);
app.use("/api", analyzeRoutes);

export { app };
