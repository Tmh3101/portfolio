import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

const createPool = () => {
  if (!env.supabaseProjectId || !env.supabaseServiceRoleKey) {
    return null;
  }

  const host = `db.${env.supabaseProjectId}.supabase.co`;
  const user = "postgres";
  const password = encodeURIComponent(env.supabaseServiceRoleKey);
  const database = "postgres";
  const connectionString = `postgresql://${user}:${password}@${host}:5432/${database}`;
  const ssl = { rejectUnauthorized: false };

  return new Pool({
    connectionString,
    ssl,
  });
};

const globalForPool = globalThis;

const cachedPool = globalForPool.__portfolioPool || null;
const pool = cachedPool || createPool();

if (process.env.NODE_ENV !== "production") {
  globalForPool.__portfolioPool = pool;
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
