import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import styles from "./CourseCard.module.css";

export default function CourseCard({ course }) {
  return (
    <Card className={styles.card}>
      <div className={styles.top}>
        <div className={styles.code}>
          {course.code} — {course.title}
        </div>
        <Badge tone="success">Goal {course.gradeGoal}%</Badge>
      </div>

      <div className={styles.meta}>{course.instructor}</div>
      <div className={styles.meta}>Starts: {course.startWeek}</div>
    </Card>
  );
}