import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { query, closeDatabase, hasDatabase } from "../src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  if (!hasDatabase) {
    console.error(
      "No database configured. Check your DATABASE_URL or SUPABASE_* env vars.",
    );
    process.exit(1);
  }

  const schemaPath = path.resolve(__dirname, "../schema.sql");
  const sql = await fs.readFile(schemaPath, "utf8");

  try {
    console.log("Applying migration from", schemaPath);
    await query(sql);
    console.log("Migration applied successfully.");
  } catch (err) {
    console.error("Migration failed:", err.message || err);
    process.exitCode = 2;
  } finally {
    await closeDatabase();
  }
}

run();
