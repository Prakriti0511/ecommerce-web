export const API_BASE = (() => {
  const envBase = import.meta.env.VITE_API_BASE?.replace(/\/$/, "");
  if (envBase) return envBase;
  if (import.meta.env.DEV) return "http://localhost:5000";
  return "";
})();

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}
