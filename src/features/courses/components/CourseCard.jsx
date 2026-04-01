import Card from "../../../components/ui/Card";
import styles from "./CourseCard.module.css";

export default function CourseCard({ course }) {
  return (
    <Card className={styles.card}>
      <div className={styles.code}>
        {course.code} — {course.title}
      </div>
      <div className={styles.meta}>{course.instructor}</div>
      <div className={styles.meta}>Goal: {course.gradeGoal}%</div>
    </Card>
  );
}