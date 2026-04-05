import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Button from "../../../components/ui/Button";
import { useCourseProgress } from "../hooks/useCourseProgress";
import ProgressDetailsCard from "../components/ProgressDetailsCard";
import ProgressBarChart from "../components/ProgressBarChart";
import styles from "./ProgressDetailPage.module.css";

function formatWeekOf(value) {
  if (!value) return "Unknown date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProgressDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { course, entries, loading, error } = useCourseProgress(courseId);

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  useEffect(() => {
    if (entries.length > 0) {
      setSelectedWeekIndex(entries.length - 1);
    }
  }, [entries]);

  const selectedEntry = entries[selectedWeekIndex] ?? null;

  const chartEntries = useMemo(
    () => entries.slice(0, selectedWeekIndex + 1),
    [entries, selectedWeekIndex]
  );

  return (
    <div className={styles.page}>
      <SectionHeader
        title={course ? `${course.code} — ${course.title}` : "Progress Details"}
        breadcrumbs={[
          { label: "Home", to: "/dashboard/courses" },
          { label: "Progress", to: "/dashboard/progress" },
          { label: course ? `${course.code} — ${course.title}` : "Course Details" },
        ]}
      />

      {!loading && !error && course && entries.length > 0 && (
        <div className={styles.toolbar}>
          <select
            className={styles.filterSelect}
            value={selectedWeekIndex}
            onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
            disabled={!entries.length}
          >
            {entries.map((entry, index) => (
              <option key={entry.progressId} value={index}>
                {`Week ${index + 1} - ${formatWeekOf(entry.weekOf)}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.body}>
        {loading && <EmptyState title="Loading" message="Loading course progress..." />}
        {!loading && error && <EmptyState title="Error" message={error} />}
        {!loading && !error && !course && (
          <EmptyState title="Course not found" message="This course does not exist." />
        )}
        {!loading && !error && course && entries.length === 0 && (
          <EmptyState title="No progress yet" message="No progress entries exist for this course." />
        )}

        {!loading && !error && course && selectedEntry && (
          <>
            <ProgressBarChart course={course} entries={chartEntries} />
            <ProgressDetailsCard
              course={course}
              entry={selectedEntry}
              weekIndex={selectedWeekIndex}
            />
          </>
        )}
      </div>

      {!loading && !error && (
        <div className={styles.footerAction}>
          <Button variant="ghost" onClick={() => navigate("/dashboard/progress")}>
            Back to All Progress
          </Button>
        </div>
      )}
    </div>
  );
}