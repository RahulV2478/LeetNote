// src/config/database.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  database: process.env.DB_NAME || "leettracket",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
