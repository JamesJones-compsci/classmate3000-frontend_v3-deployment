import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import styles from "./ProgressSummaryCard.module.css";

export default function ProgressSummaryCard({ course, entry, snapshotCount = 0, onClick }) {
  return (
    <Card className={styles.card} clickable onClick={onClick}>
      <div className={styles.top}>
        <div className={styles.course}>
          {course.code} — {course.title}
        </div>
        <Badge tone="progress">{entry.currentGradePercent ?? "—"}%</Badge>
      </div>

      <div className={styles.meta}>Latest week: {entry.weekOf ?? "—"}</div>
      <div className={styles.meta}>Accumulated: {entry.accumulatedPercentPoints ?? "—"}%</div>
      <div className={styles.meta}>Max possible: {entry.maxPossiblePercent ?? "—"}%</div>
      <div className={styles.footer}>
        <Badge tone={entry.canMeetGoal ? "success" : "danger"}>
          {entry.canMeetGoal ? "Can meet goal" : "At risk"}
        </Badge>
        <span className={styles.count}>{snapshotCount} week(s)</span>
      </div>
    </Card>
  );
}