import { apiClient } from "./client";

export async function login(payload) {
  const res = await apiClient.post("/api/v1/auth/login", {
    email: payload.email.trim(),
    password: payload.password,
  });

  return {
    token: res.data.token,
    firstName: res.data.firstName ?? "",
    lastName: res.data.lastName ?? "",
    email: payload.email.trim(),
  };
}

export async function register(payload) {
  const res = await apiClient.post("/api/v1/auth/register", {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim(),
    password: payload.password,
  });

  return {
    token: res.data.token,
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim(),
  };
}