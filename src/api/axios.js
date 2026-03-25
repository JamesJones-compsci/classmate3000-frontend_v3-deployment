// src/api/axios.js
// Axios instance shared across the entire app.
// All authenticated requests are routed through the API Gateway on port 8091.
// The interceptor automatically attaches the JWT Bearer token to every
// non-public request so individual components never handle auth headers manually.

import axios from "axios";

// Read the gateway URL from the environment file (.env).
// Default falls back to the correct API Gateway port (8091), NOT the user-service port (8088).
const baseURL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8091";

// Request interceptor — attaches JWT token to every outgoing request.
// Auth endpoints (/api/v1/auth/*) are skipped because they are public routes
// that do not require a token (login, register).
const attachToken = (config) => {
  const url = config?.url || "";

  // Skip token attachment for public auth endpoints.
  if (url.startsWith("/api/v1/auth/")) return config;

  // Token is stored in sessionStorage for improved security.
  // sessionStorage is cleared automatically when the browser tab is closed.
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const api = axios.create({ baseURL });

// Attach the token interceptor to every outgoing request.
api.interceptors.request.use(attachToken);