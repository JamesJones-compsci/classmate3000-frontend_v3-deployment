import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import { useCourses } from "../../courses/hooks/useCourses";
import { useProgress } from "../hooks/useProgress";
import ProgressSummaryCard from "../components/ProgressSummaryCard";
import styles from "./ProgressPage.module.css";

export default function ProgressPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeFilter = searchParams.get("filter") || "all";

  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { progressEntries, loading: progressLoading, error: progressError } = useProgress();

  const loading = coursesLoading || progressLoading;
  const error = coursesError || progressError;

  const courseCards = useMemo(() => {
    const mapped = courses
      .map((course) => {
        const entries = progressEntries
          .filter((entry) => Number(entry.courseId) === Number(course.courseId))
          .sort((a, b) => new Date(a.weekOf) - new Date(b.weekOf));

        const latest = entries[entries.length - 1] ?? null;
        if (!latest) return null;

        const currentGradePercent = Number(latest.currentGradePercent ?? 0);
        const maxPossiblePercent = Number(latest.maxPossiblePercent ?? 0);
        const gradeGoal = Number(course.gradeGoal ?? 0);

        const isMeetingGoal = currentGradePercent >= gradeGoal;
        const isCannotMeetGoal = maxPossiblePercent < gradeGoal;
        const isAtRisk =
          !isMeetingGoal &&
          !isCannotMeetGoal &&
          maxPossiblePercent <= gradeGoal + 10;

        return {
          course,
          latest,
          count: entries.length,
          isMeetingGoal,
          isAtRisk,
          isCannotMeetGoal,
        };
      })
      .filter(Boolean);

    if (activeFilter === "meetingGoal") {
      return mapped.filter((item) => item.isMeetingGoal);
    }

    if (activeFilter === "atRisk") {
      return mapped.filter((item) => item.isAtRisk);
    }

    if (activeFilter === "cannotMeetGoal") {
      return mapped.filter((item) => item.isCannotMeetGoal);
    }

    return mapped;
  }, [courses, progressEntries, activeFilter]);

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Progress"
        breadcrumbs={[
          { label: "Home", to: "/dashboard/courses" },
          { label: "Progress" },
        ]}
      />

      <div className={styles.body}>
        {loading && <EmptyState title="Loading" message="Loading progress..." />}
        {!loading && error && <EmptyState title="Error" message={error} />}
        {!loading && !error && courseCards.length === 0 && (
          <EmptyState
            title="No progress found"
            message="No courses match this filter."
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