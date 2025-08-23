export const API = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function apiGet(path, params = {}) {
  const url = new URL(API + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}
