import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;
// Build a Supabase-only connection using the project ref and service role key.
// This code requires `SUPABASE_PROJECT_ID` and `SUPABASE_SERVICE_ROLE_KEY` to be set.
let pool = null;

if (env.supabaseProjectId && env.supabaseServiceRoleKey) {
  const host = `${env.supabaseProjectId}.db.supabase.co`;
  const user = "postgres";
  const password = encodeURIComponent(env.supabaseServiceRoleKey);
  const database = "postgres";
  const connectionString = `postgresql://${user}:${password}@${host}:5432/${database}`;
  const ssl = { rejectUnauthorized: false };

  pool = new Pool({
    connectionString,
    ssl,
  });
}

export const hasDatabase = Boolean(pool);

export const query = async (text, params = []) => {
  if (!pool) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  return pool.query(text, params);
};

export const checkDatabase = async () => {
  if (!pool) {
    return false;
  }

  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
};

export const closeDatabase = async () => {
  if (!pool) {
    return;
  }

  await pool.end();
};
