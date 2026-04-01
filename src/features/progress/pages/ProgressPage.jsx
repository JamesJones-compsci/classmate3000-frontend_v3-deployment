import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import { useCourses } from "../../courses/hooks/useCourses";
import { useProgress } from "../hooks/useProgress";
import ProgressSummaryCard from "../components/ProgressSummaryCard";
import styles from "./ProgressPage.module.css";

export default function ProgressPage() {
  const navigate = useNavigate();
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { progressEntries, loading: progressLoading, error: progressError } = useProgress();

  const loading = coursesLoading || progressLoading;
  const error = coursesError || progressError;

  const courseCards = useMemo(() => {
    return courses
      .map((course) => {
        const entries = progressEntries
          .filter((entry) => Number(entry.courseId) === Number(course.courseId))
          .sort((a, b) => new Date(a.weekOf) - new Date(b.weekOf));

        const latest = entries[entries.length - 1] ?? null;

        return {
          course,
          latest,
          count: entries.length,
        };
      })
      .filter((item) => item.latest);
  }, [courses, progressEntries]);

  return (
    <div className={styles.page}>
      <SectionHeader title="Progress" breadcrumb="Home > Progress" />

      <div className={styles.body}>
        {loading && <EmptyState title="Loading" message="Loading progress..." />}
        {!loading && error && <EmptyState title="Error" message={error} />}
        {!loading && !error && courseCards.length === 0 && (
          <EmptyState
            title="No progress yet"
            message="Add progress entries first. Then each course will appear here."
          />
        )}

        {!loading && !error && courseCards.length > 0 && (
          <div className={styles.grid}>
            {courseCards.map(({ course, latest, count }) => (
              <ProgressSummaryCard
                key={course.courseId}
                course={course}
                entry={latest}
                snapshotCount={count}
                onClick={() => navigate(`/dashboard/progress/${course.courseId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}