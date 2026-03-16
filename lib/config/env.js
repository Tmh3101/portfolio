const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const splitList = (value) =>
  value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean) || [];

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 3000),
  appTimeZone: process.env.APP_TIMEZONE || 'Asia/Ho_Chi_Minh',
  supabaseProjectId: process.env.SUPABASE_PROJECT_ID || '',
  supabaseDbPassword: process.env.SUPABASE_DB_PASSWORD || '',
  // Prefer public env vars (as per Supabase Next.js docs), but also support server-only names
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  googleGeminiApiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
  googleGeminiModel: process.env.GOOGLE_GEMINI_MODEL || 'gemini-2.5-flash-lite',
  resendApiKey: process.env.RESEND_API_KEY || '',
  allowedOrigins: splitList(process.env.APP_ORIGIN),
  mailFrom: process.env.MAIL_FROM || process.env.SMTP_USER || '',
  contactToEmail: process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER || '',
  adminApiKey: process.env.ADMIN_API_KEY || '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  jwtAccessTtl: process.env.JWT_ACCESS_TTL || '15m',
  jwtRefreshTtl: process.env.JWT_REFRESH_TTL || '7d',
};
