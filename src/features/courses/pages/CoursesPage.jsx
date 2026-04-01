import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { useCourses } from "../hooks/useCourses";
import { useTasks } from "../../tasks/hooks/useTasks";
import { useProgress } from "../../progress/hooks/useProgress";
import CourseCard from "../components/CourseCard";
import CourseForm from "../components/CourseForm";
import styles from "./CoursesPage.module.css";

export default function CoursesPage() {
  const navigate = useNavigate();
  const { courses, loading, error, addCourse } = useCourses();
  const { tasks } = useTasks();
  const { progressEntries } = useProgress();

  const [showCreate, setShowCreate] = useState(false);

  const courseSummaries = useMemo(() => {
    return courses.map((course) => {
      const relatedTasks = tasks.filter(
        (task) => Number(task.courseId) === Number(course.courseId)
      );

      const relatedProgress = progressEntries
        .filter((entry) => Number(entry.courseId) === Number(course.courseId))
        .sort((a, b) => new Date(a.weekOf) - new Date(b.weekOf));

      const latestProgress = relatedProgress[relatedProgress.length - 1] ?? null;

      return {
        course,
        taskCount: relatedTasks.length,
        latestProgress,
      };
    });
  }, [courses, tasks, progressEntries]);

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Courses"
        breadcrumbs={[
          { label: "Home", to: "/dashboard/courses" },
          { label: "Courses" },
        ]}
        actions={
          <Button variant="courses" onClick={() => setShowCreate(true)}>
            Add Course
          </Button>
        }
      />

      <div className={styles.body}>
        {loading && <EmptyState title="Loading" message="Loading courses..." />}
        {!loading && error && <EmptyState title="Error" message={error} />}
        {!loading && !error && courseSummaries.length === 0 && (
          <EmptyState
            title="No courses yet"
            message="Create your first course to get started."
          />
        )}

        {!loading && !error && courseSummaries.length > 0 && (
          <div className={styles.grid}>
            {courseSummaries.map(({ course, taskCount, latestProgress }) => (
              <div
                key={course.courseId}
                className={styles.selectable}
                onClick={() => navigate(`/dashboard/courses/${course.courseId}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/dashboard/courses/${course.courseId}`);
                  }
                }}
              >
                <CourseCard course={course} />

                <div className={styles.meta}>
                  <span>Tasks: {taskCount}</span>
                  <span>
                    Latest grade:{" "}
                    {latestProgress?.currentGrade != null
                      ? `${latestProgress.currentGrade}%`
                      : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Add Course" onClose={() => setShowCreate(false)}>
          <CourseForm
            mode="create"
            onCancel={() => setShowCreate(false)}
            onSubmit={async (payload) => {
              const created = await addCourse(payload);
              setShowCreate(false);
              if (created?.courseId != null) {
                navigate(`/dashboard/courses/${created.courseId}`);
              }
            }}
          />
        </Modal>
      )}
    </div>
  );
}