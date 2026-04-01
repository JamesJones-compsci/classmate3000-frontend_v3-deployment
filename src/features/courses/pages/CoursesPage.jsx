import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import { useCourses } from "../hooks/useCourses";
import CourseCard from "../components/CourseCard";
import styles from "./CoursesPage.module.css";

export default function CoursesPage() {
  const { courses, loading, error } = useCourses();

  return (
    <div className={styles.page}>
      <SectionHeader title="Courses" breadcrumb="Home > Courses > All Courses" />

      <div className={styles.body}>
        {loading && <EmptyState message="Loading courses..." />}
        {!loading && error && <EmptyState message={error} />}
        {!loading && !error && courses.length === 0 && (
          <EmptyState message="No courses yet." />
        )}

        {!loading && !error && courses.length > 0 && (
          <div className={styles.grid}>
            {courses.map((course) => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}