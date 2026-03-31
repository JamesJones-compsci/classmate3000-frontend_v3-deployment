import { apiClient } from "./client";

export async function getCourses() {
  const { data } = await apiClient.get("/api/v1/courses");
  return data;
}

export async function createCourse(payload) {
  const { data } = await apiClient.post("/api/v1/courses", payload);
  return data;
}

export async function updateCourse(id, payload) {
  const { data } = await apiClient.put(`/api/v1/courses/${id}`, payload);
  return data;
}

export async function deleteCourse(id) {
  await apiClient.delete(`/api/v1/courses/${id}`);
}