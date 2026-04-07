import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { useCourseProgress } from "../hooks/useCourseProgress";
import { useTasks } from "../../tasks/hooks/useTasks";
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

function getEarnedMarks(task) {
  if (task?.scorePercent == null || task?.weight == null) return 0;
  return Number(((task.weight * task.scorePercent) / 100).toFixed(1));
}

function getLostMarks(task) {
  if (task?.scorePercent == null || task?.weight == null) return 0;
  return Number((task.weight - getEarnedMarks(task)).toFixed(1));
}

export default function ProgressDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { course, entries, loading, error } = useCourseProgress(courseId);
  const { tasks } = useTasks();

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

  const completedTasks = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          Number(task.courseId) === Number(courseId) &&
          task.isCompleted
      )
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
  }, [tasks, courseId]);

  const accumulatedTasks = useMemo(() => {
    return completedTasks.filter((task) => getEarnedMarks(task) > 0);
  }, [completedTasks]);

  const lostTasks = useMemo(() => {
    return completedTasks.filter((task) => getLostMarks(task) > 0);
  }, [completedTasks]);

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

          {selectedEntry ? (
            <Badge tone={selectedEntry.canMeetGoal ? "success" : "danger"}>
              {selectedEntry.canMeetGoal ? "Can meet goal" : "At risk"}
            </Badge>
          ) : null}
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

            <div className={styles.grid}>
              <section className={styles.panel}>
                <h3 className={styles.panelTitle}>Accumulated Marks</h3>

                {accumulatedTasks.length === 0 ? (
                  <p className={styles.muted}>No accumulated marks yet.</p>
                ) : (
                  <div className={styles.taskList}>
                    {accumulatedTasks.map((task) => (
                      <button
                        key={task.taskId}
                        type="button"
                        className={styles.taskLink}
                        onClick={() => navigate(`/dashboard/tasks/${task.taskId}`)}
                      >
                        <div className={styles.taskContent}>
                          <div className={styles.taskMainRow}>
                            <span>{task.title}</span>
                            <span>{getEarnedMarks(task)}%</span>
                          </div>

                          <div className={styles.taskMetaRow}>
                            <span>{task.type || "—"}</span>
                            <span>
                              {task.weight != null ? `${task.weight}%` : "—"} · {task.scorePercent ?? "—"}%
                            </span>
                          </div>
                        </div>

                        <span className={styles.taskArrow}>›</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className={styles.panel}>
                <h3 className={styles.panelTitle}>Lost Marks</h3>

                {lostTasks.length === 0 ? (
                  <p className={styles.muted}>No lost marks yet.</p>
                ) : (
                  <div className={styles.taskList}>
                    {lostTasks.map((task) => (
                      <button
                        key={task.taskId}
                        type="button"
                        className={styles.taskLink}
                        onClick={() => navigate(`/dashboard/tasks/${task.taskId}`)}
                      >
                        <div className={styles.taskContent}>
                          <div className={styles.taskMainRow}>
                            <span>{task.title}</span>
                            <span>{getLostMarks(task)}%</span>
                          </div>

                          <div className={styles.taskMetaRow}>
                            <span>{task.type || "—"}</span>
                            <span>
                              {task.weight != null ? `${task.weight}%` : "—"} · {task.scorePercent ?? "—"}%
                            </span>
                          </div>
                        </div>

                        <span className={styles.taskArrow}>→</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>
      <div className={styles.bottomAction}>
        <Button variant="ghost" onClick={() => navigate("/dashboard/progress")}>
          Back to All Progress
        </Button>
      </div>
     
    </div>
  );
}