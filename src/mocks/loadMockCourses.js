import courses from "./courses.mock.json";

export function loadMockCourses() {
  // Normalize to always return an array
  if (Array.isArray(courses)) return courses;
  if (courses?.courses && Array.isArray(courses.courses)) return courses.courses;
  return [];
}
