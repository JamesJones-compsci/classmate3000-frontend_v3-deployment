import axios from "axios";

/**
 * Single API Gateway client
 * - Base URL comes from Vite env
 * - Fallback to localhost gateway if env is missing
 */
const baseURL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8091";

/**
 * Attach JWT to requests EXCEPT auth endpoints.
 * Rationale: login/register must be public and should not fail because of a stale/invalid token.
 */
const attachToken = (config) => {
  const url = config?.url || "";

  // Do not attach token to auth endpoints
  if (url.startsWith("/api/v1/auth/")) return config;

  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const api = axios.create({ baseURL });

api.interceptors.request.use(attachToken);
