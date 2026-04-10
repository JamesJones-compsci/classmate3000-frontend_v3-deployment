import { apiClient } from "./client";

export async function getTasks() {
  const { data } = await apiClient.get("/api/v1/tasks");
  return data;
}

export async function createTask(payload) {
  const { data } = await apiClient.post("/api/v1/tasks", payload);
  return data;
}

export async function updateTask(id, payload) {
  const { data } = await apiClient.put(`/api/v1/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id) {
  await apiClient.delete(`/api/v1/tasks/${id}`);
}