// src/controllers/documentController.js
import { pool } from "../config/database.js";

export const getDocuments = async (req, res) => {
  try {
    const [docs] = await pool.query("SELECT * FROM documents");
    res.json({ documents: docs });
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getDocumentById = async (req, res) => {
  const docId = req.params.id;
  try {
    const [docs] = await pool.query("SELECT * FROM documents WHERE id = ?", [docId]);
    if (docs.length === 0) return res.status(404).json({ error: "Document not found." });
    res.json({ document: docs[0] });
  } catch (err) {
    console.error("Error fetching document:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const createDocument = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required." });
  try {
    const [result] = await pool.query("INSERT INTO documents (user_id, title, last_edited) VALUES (?, ?, ?)", [1, title, "Just now"]);
    res.json({ message: "Document created successfully.", id: result.insertId });
  } catch (err) {
    console.error("Error creating document:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const updateDocument = async (req, res) => {
  const docId = req.params.id;
  const { title, problemName, language, code, analysis } = req.body;
  try {
    const [docs] = await pool.query("SELECT * FROM documents WHERE id = ?", [docId]);
    if (docs.length === 0) return res.status(404).json({ error: "Document not found." });
    await pool.query(
      "UPDATE documents SET title = ?, problem_name = ?, language = ?, code = ?, analysis = ? WHERE id = ?",
      [title, problemName, language, code, JSON.stringify(analysis), docId]
    );
    res.json({ message: "Document updated successfully." });
  } catch (err) {
    console.error("Error updating document:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const deleteDocument = async (req, res) => {
  const docId = req.params.id;
  try {
    const [docs] = await pool.query("SELECT * FROM documents WHERE id = ?", [docId]);
    if (docs.length === 0) return res.status(404).json({ error: "Document not found." });
    await pool.query("DELETE FROM documents WHERE id = ?", [docId]);
    res.json({ message: "Document deleted successfully." });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
