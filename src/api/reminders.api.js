import { apiClient } from "./client";

export async function getReminders() {
  const { data } = await apiClient.get("/api/v1/reminders");
  return data;
}

export async function createReminder(payload) {
  const { data } = await apiClient.post("/api/v1/reminders", payload);
  return data;
}

export async function updateReminder(id, payload) {
  const { data } = await apiClient.put(`/api/v1/reminders/${id}`, payload);
  return data;
}

export async function deleteReminder(id) {
  await apiClient.delete(`/api/v1/reminders/${id}`);
}