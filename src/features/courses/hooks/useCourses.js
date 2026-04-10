import { useEffect, useState } from "react";
import { coursesService } from "../services/courses.service";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadCourses() {
    setLoading(true);
    setError(null);
    try {
      const data = await coursesService.getCourses();
      setCourses(data);
    } catch {
      setError("Could not load courses.");
    } finally {
      setLoading(false);
    }
  }

  async function addCourse(payload) {
    const created = await coursesService.createCourse(payload);
    setCourses((prev) => [...prev, created]);
    return created;
  }

  async function editCourse(id, payload) {
    const updated = await coursesService.updateCourse(id, payload);
    setCourses((prev) =>
      prev.map((course) =>
        Number(course.courseId) === Number(id) ? updated : course
      )
    );
    return updated;
  }

  async function removeCourse(id) {
    await coursesService.deleteCourse(id);
    setCourses((prev) =>
      prev.filter((course) => Number(course.courseId) !== Number(id))
    );
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    loadCourses,
    addCourse,
    editCourse,
    removeCourse,
  };
}