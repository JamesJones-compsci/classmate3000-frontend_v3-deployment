import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import styles from "./CourseCard.module.css";

function formatStartWeek(dateValue) {
  if (!dateValue) return "No start date";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CourseCard({ course }) {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.code}>{course.code}</div>
          <div className={styles.title}>{course.title}</div>
        </div>

        <Badge tone="success">Goal {course.gradeGoal}%</Badge>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoBlock}>
          <div className={styles.label}>Instructor</div>
          <div className={styles.value}>{course.instructor || "Not set"}</div>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.label}>Start Week</div>
          <div className={styles.value}>{formatStartWeek(course.startWeek)}</div>
        </div>
      </div>
    </Card>
  );
}