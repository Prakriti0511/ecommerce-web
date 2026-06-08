export const API_BASE = (() => {
  // In dev, use same-origin requests via the Vite /api proxy so auth cookies work.
  if (import.meta.env.DEV) return "";
  const envBase = import.meta.env.VITE_API_BASE?.replace(/\/$/, "");
  return envBase || "";
})();

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}
