// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided." });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_default_secret");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Failed to authenticate token." });
  }
};
