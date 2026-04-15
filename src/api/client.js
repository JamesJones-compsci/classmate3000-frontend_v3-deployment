// Penny - Refactored as part of extracting the api layer by feature
// src/api/client.js
// Central API client for ClassMate.
// Handles base URL + JWT attachment.
// Used by all feature API modules (courses, tasks, reminders, progress).
// All authenticated requests are routed through the API Gateway on port 8091.

import axios from "axios";
import { USE_MOCK_API } from "../config/env"; // For dev mode to circumvent login

// Added this request queue guard
let pendingRequests = 0;

// Read the gateway URL from the environment file (.env).
// Default falls back to the correct API Gateway port (8091), NOT the user-service port (8088).
const baseURL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8091";

// Create instance
export const apiClient = axios.create({ baseURL, timeout: 8000 });

// Request interceptor — attaches JWT token to every outgoing request.
// Auth endpoints (/api/v1/auth/*) are skipped because they are public routes
// that do not require a token (login, register).
apiClient.interceptors.request.use((config) => {
  const url = config?.url || "";
  // Skip token attachment for public auth endpoints.
  if (url.startsWith("/api/v1/auth/")) {

    // Prevet spam login/register requests by checking if there are pending requests.
    if (pendingRequests > 0) {
      return Promise.reject(new Error("Please wait for the previous request to complete."));
    }
    pendingRequests++;
  }

  // Token is stored in sessionStorage for improved security.
  // sessionStorage is cleared automatically when the browser tab is closed.
  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor — handles global response errors (e.g., 401 Unauthorized).
apiClient.interceptors.response.use(
  (response) => {
    pendingRequests = Math.max(0, pendingRequests - 1);
    return response;
  },
  (error) => {
    pendingRequests = Math.max(0, pendingRequests - 1);
    return Promise.reject(error);
  }
);