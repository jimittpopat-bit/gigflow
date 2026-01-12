export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // IMPORTANT for cookie login
  });
  
  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }
  
  return data;
}

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000",
  withCredentials: true, // IMPORTANT: cookies across Vercel ↔ Render
});

export default api;
