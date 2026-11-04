import "dotenv/config";
import mysql from "mysql2/promise";
import process from "node:process";
import { readFile } from "node:fs/promises";
import pool from "./db.js";

export async function initializeDatabase() {
  try {
    await pool.query("SELECT 1");
  } catch (error) {
    if (error.code !== "ER_BAD_DB_ERROR") throw error;
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3307),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
      connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 5000),
    });
    try {
      const name = mysql.escapeId(process.env.DB_NAME);
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    } finally {
      await connection.end();
    }
  }

  // Reuse the canonical table definitions, without inserting sample products.
  const schema = await readFile(new URL("../database/schema.sql", import.meta.url), "utf8");
  const statements = schema.split(";").map((sql) => sql.trim())
    .filter((sql) => /^CREATE TABLE IF NOT EXISTS /i.test(sql));
  for (const statement of statements) {
    await pool.query(statement);
    const table = statement.match(/^CREATE TABLE IF NOT EXISTS (\w+)/i)[1];
    // IF NOT EXISTS alone does not detect an unreadable InnoDB table.
    await pool.query(`SELECT 1 FROM ${mysql.escapeId(table)} LIMIT 0`);
  }
  const [staffColumns] = await pool.execute("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME='inventory_users' AND COLUMN_NAME='staff_id'", [process.env.DB_NAME]);
  if (staffColumns.length === 0) await pool.query("ALTER TABLE inventory_users ADD COLUMN staff_id VARCHAR(24) NULL UNIQUE");
  const [columns] = await pool.execute(
    "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'booking_requests' AND COLUMN_NAME = 'response_message'",
    [process.env.DB_NAME],
  );
  if (columns.length === 0) {
    await pool.query("ALTER TABLE booking_requests ADD COLUMN response_message VARCHAR(500) NULL");
  }
}

export function databaseStartupMessage(error) {
  const endpoint = `${process.env.DB_HOST}:${process.env.DB_PORT || 3307}`;
  if (error.code === "ECONNREFUSED") {
    return `Cannot connect to MariaDB at ${endpoint}. Start MySQL in XAMPP and confirm its configured port matches DB_PORT in .env. If MySQL stops immediately, inspect the MySQL error log first.`;
  }
  if (error.errno === 1932 || error.code === "ER_NO_SUCH_TABLE_IN_ENGINE") {
    return `Database startup failed: ${error.sqlMessage || error.message}. The configured MariaDB instance contains stale InnoDB table entries. Do not drop or overwrite database files. Verify the configured database against a known-good backup and repair it with a logical SQL export/import before restarting the API.`;
  }
  return `Unable to initialize inventory database: ${error.message}`;
}
