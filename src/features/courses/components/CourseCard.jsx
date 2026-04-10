import Card from "../../../components/ui/Card";
import styles from "./CourseCard.module.css";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function formatTime(timeValue) {
  if (!timeValue) return "";
  const [h, m] = timeValue.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  }).toLowerCase();
}

function getMeetingLines(course) {
  if (!course?.meetings?.length) return [];
  return course.meetings.map((meeting) => {
    const day = DAY_LABELS[meeting.dayOfWeek] || "—";
    const start = formatTime(meeting.startTime);
    const end = formatTime(meeting.endTime);
    return `${day}: ${start}-${end}`;
  });
}

function formatShortDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function CourseCard({
  course,
  upcomingTasks = [],
  latestProgress = null,
}) {
  const meetingLines = getMeetingLines(course);

  const upcomingPreview = [...upcomingTasks]
    .filter((task) => !task.isCompleted)
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, 3);

  return (
    <Card className={styles.card} clickable>
      <h3 className={styles.title}>
        {course.code} - {course.title}
      </h3>

      <div className={styles.meetings}>
        {meetingLines.length === 0 ? (
          <div className={styles.emptyText}>No scheduled meetings</div>
        ) : (
          meetingLines.map((line) => <div key={line}>{line}</div>)
        )}
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>UPCOMING</div>

          {upcomingPreview.length === 0 ? (
            <div className={styles.emptyText}>No upcoming tasks</div>
          ) : (
            upcomingPreview.map((task) => (
              <div key={task.taskId} className={styles.taskPreviewItem}>
                {formatShortDate(task.dueDate)}: {task.title}
              </div>
            ))
          )}
        </div>

        <div className={styles.panel}>
          <div className={styles.progressBlock}>
            <div>
              <div className={styles.panelTitle}>PROGRESS</div>
              <div className={styles.metricValue}>
                {latestProgress?.maxPossiblePercent != null
                  ? `${latestProgress.maxPossiblePercent}%`
                  : "—"}
              </div>
            </div>

            <div>
              <div className={styles.panelTitle}>CURR. GRADE</div>
              <div className={styles.metricValue}>
                {latestProgress?.currentGradePercent != null
                  ? `${latestProgress.currentGradePercent}%`
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}