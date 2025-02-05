// src/controllers/codeBlockController.js
import { pool } from "../config/database.js";

export const getCodeBlocks = async (req, res) => {
  const { documentId } = req.params;
  try {
    const [blocks] = await pool.query("SELECT * FROM codeblocks WHERE document_id = ?", [documentId]);
    res.json({ codeblocks: blocks });
  } catch (err) {
    console.error("Error fetching codeblocks:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const createCodeBlock = async (req, res) => {
  const { documentId } = req.params;
  const { language, code, analysis, hint } = req.body;
  if (!language || !code)
    return res.status(400).json({ error: "Language and code are required." });
  try {
    const [result] = await pool.query(
      "INSERT INTO codeblocks (document_id, language, code, analysis, hint) VALUES (?, ?, ?, ?, ?)",
      [documentId, language, code, analysis || null, hint || null]
    );
    res.json({ message: "Codeblock created successfully.", id: result.insertId });
  } catch (err) {
    console.error("Error creating codeblock:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const deleteCodeBlock = async (req, res) => {
  const { id } = req.params;
  try {
    const [blocks] = await pool.query("SELECT * FROM codeblocks WHERE id = ?", [id]);
    if (blocks.length === 0) return res.status(404).json({ error: "Codeblock not found." });
    await pool.query("DELETE FROM codeblocks WHERE id = ?", [id]);
    res.json({ message: "Codeblock deleted successfully." });
  } catch (err) {
    console.error("Error deleting codeblock:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
