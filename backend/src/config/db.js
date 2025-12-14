// backend/src/config/db.js
const { Pool } = require("pg");

let pool;

if (process.env.DATABASE_URL) {
  // ✅ Production / Render / Docker
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // ✅ Local development
  pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PG error", err);
  process.exit(1);
});

module.exports = pool;
