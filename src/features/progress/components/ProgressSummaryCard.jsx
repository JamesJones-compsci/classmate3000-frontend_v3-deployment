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

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricTitle}>Accumulated</div>
          <div className={styles.metricValue}>{entry.accumulatedPercentPoints ?? "—"}%</div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricTitle}>Lost Marks</div>
          <div className={styles.metricValue}>{entry.lostPercentPoints ?? "—"}%</div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricTitle}>Max Possible</div>
          <div className={styles.metricValue}>{entry.maxPossiblePercent ?? "—"}%</div>
        </div>
      </div>

      <div className={styles.footer}>
        <Badge tone={entry.canMeetGoal ? "success" : "danger"}>
          {entry.canMeetGoal ? "Can meet goal" : "At risk"}
        </Badge>
        <span className={styles.count}>Week {snapshotCount}</span>
      </div>
    </Card>
  );
}