import { apiClient } from "./client";

export async function getProgress() {
  const { data } = await apiClient.get("/api/v1/progress");
  return data;
}

export async function createProgress(payload) {
  const { data } = await apiClient.post("/api/v1/progress", payload);
  return data;
}

export async function updateProgress(id, payload) {
  const { data } = await apiClient.put(`/api/v1/progress/${id}`, payload);
  return data;
}

export async function deleteProgress(id) {
  await apiClient.delete(`/api/v1/progress/${id}`);
}