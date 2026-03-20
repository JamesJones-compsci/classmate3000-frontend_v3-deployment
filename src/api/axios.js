import axios from "axios";

const baseURL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8091";

const attachToken = (config) => {
  const url = config?.url || "";

  //Do not attach token to public auth endpoints.
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