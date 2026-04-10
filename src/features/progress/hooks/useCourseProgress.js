import { useMemo } from "react";
import { useCourses } from "../../courses/hooks/useCourses";
import { useProgress } from "./useProgress";

export function useCourseProgress(courseId) {
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useCourses();

  const {
    progressEntries,
    loading: progressLoading,
    error: progressError,
    addProgress,
    editProgress,
    removeProgress,
  } = useProgress();

  const numericCourseId = Number(courseId);

  const course = useMemo(
    () => courses.find((c) => Number(c.courseId) === numericCourseId) ?? null,
    [courses, numericCourseId]
  );

  const entries = useMemo(() => {
    return progressEntries
      .filter((entry) => Number(entry.courseId) === numericCourseId)
      .sort((a, b) => new Date(a.weekOf) - new Date(b.weekOf));
  }, [progressEntries, numericCourseId]);

  return {
    course,
    entries,
    loading: coursesLoading || progressLoading,
    error: coursesError || progressError,
    addProgress,
    editProgress,
    removeProgress,
  };
}