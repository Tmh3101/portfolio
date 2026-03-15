import { query, closeDatabase, hasDatabase } from "../src/config/db.js";

(async () => {
  if (!hasDatabase) {
    console.error("No DB configured");
    process.exit(1);
  }

  try {
    const res = await query("SELECT count(*) FROM contacts;");
    console.log("contacts_count:", res.rows[0]);
  } catch (err) {
    console.error("Query failed:", err.message || err);
    process.exit(2);
  } finally {
    await closeDatabase();
  }
})();
