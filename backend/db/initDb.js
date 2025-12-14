const fs = require("fs");
const path = require("path");
const pool = require("../config/db");


async function initDb() {
  try {
    const sqlPath = path.join(__dirname, "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("🟡 Running DB initialization...");
    await pool.query(sql);
    console.log("🟢 Database initialized successfully");
  } catch (err) {
    console.error("🔴 DB init failed:", err.message);
    process.exit(1);
  }
}

module.exports = initDb;
