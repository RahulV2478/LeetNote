// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required." });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials." });
    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials." });
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required." });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length > 0) return res.status(400).json({ error: "User already exists." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
    return res.json({ message: "User registered successfully.", userId: result.insertId });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
