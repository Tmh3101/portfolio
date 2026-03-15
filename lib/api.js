const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const normalizedApiBaseUrl = rawApiBaseUrl.endsWith('/')
  ? rawApiBaseUrl.slice(0, -1)
  : rawApiBaseUrl;

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedApiBaseUrl}${normalizedPath}`;
};
