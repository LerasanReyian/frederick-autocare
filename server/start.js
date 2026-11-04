import "dotenv/config";
import process from "node:process";
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import mysql from "mysql2/promise";

async function checkDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3307),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    connectTimeout: 1500,
  });
  try {
    const [[server]] = await connection.query("SELECT @@datadir AS directory");
    const expected = fileURLToPath(new URL("../.local-db-restored/", import.meta.url));
    const normalize = (path) => path.replaceAll("\\", "/").replace(/\/$/, "").toLowerCase();
    if (normalize(server.directory) !== normalize(expected)) {
      throw new Error("The configured port belongs to another database. Check DB_PORT before starting the recovered database.");
    }
  } finally {
    await connection.end();
  }
}

async function start() {
  if (process.env.LOCAL_DB_AUTOSTART === "true") {
    if (!["127.0.0.1", "localhost"].includes(process.env.DB_HOST) || !Number.isInteger(Number(process.env.DB_PORT)) || Number(process.env.DB_PORT) < 1024 || Number(process.env.DB_PORT) > 65535) {
      throw new Error("The recovered database requires a loopback DB_HOST and a valid DB_PORT above 1023.");
    }
    try {
      await checkDatabase();
    } catch (error) {
      if (error.code !== "ECONNREFUSED") throw error;
      const config = fileURLToPath(new URL("../.local-db-restored/my.ini", import.meta.url));
      await access(config);
      console.log(`Starting recovered local MariaDB on port ${process.env.DB_PORT}...`);
      const child = spawn(process.env.LOCAL_DB_EXECUTABLE || "C:/xampp/mysql/bin/mysqld.exe", [`--defaults-file=${config}`, `--port=${process.env.DB_PORT}`], {
        detached: true, windowsHide: true, stdio: "ignore",
      });
      await new Promise((resolve, reject) => {
        child.once("spawn", resolve);
        child.once("error", reject);
      });
      child.unref();
      let ready = false;

      for (let attempt = 0; attempt < 40; attempt += 1) {
        try {
          await checkDatabase();
          ready = true;
          break;
        } catch (connectionError) {
          if (connectionError.code !== "ECONNREFUSED") throw connectionError;

          await delay(250);
        }
      }
      if (!ready) throw new Error("MariaDB did not start. Check .local-db-restored/local-db.log.", { cause: error });
    }
  }
  await import("./index.js");
}

start().catch((error) => {
  console.error(`Unable to start the server: ${error.message}`);
  process.exitCode = 1;
});
