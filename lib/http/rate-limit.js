const globalStore = globalThis;

const store = globalStore.__portfolioRateLimit || new Map();

if (process.env.NODE_ENV !== 'production') {
  globalStore.__portfolioRateLimit = store;
}

export const checkRateLimit = ({ key, limit, windowMs }) => {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.expiresAt <= now) {
    const nextEntry = { count: 1, expiresAt: now + windowMs };
    store.set(key, nextEntry);
    return { ok: true, remaining: limit - 1, resetAt: nextEntry.expiresAt };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetAt: entry.expiresAt };
  }

  entry.count += 1;
  store.set(key, entry);

  return { ok: true, remaining: Math.max(0, limit - entry.count), resetAt: entry.expiresAt };
};
