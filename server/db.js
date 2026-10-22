import mysql from "mysql2/promise";
import process from "node:process";

const requiredEnvironment = ["DB_HOST", "DB_USER", "DB_NAME"];
const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]);

if (missingEnvironment.length > 0) {
  throw new Error(`Missing required database configuration: ${missingEnvironment.join(", ")}`);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 5000),
  timezone: "+08:00",
  queueLimit: 0,
  decimalNumbers: true,
});

export default pool;
