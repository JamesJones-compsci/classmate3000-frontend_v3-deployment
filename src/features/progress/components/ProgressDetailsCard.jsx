import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import styles from "./ProgressDetailsCard.module.css";

export default function ProgressDetailsCard({ course, entry, weekIndex }) {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.course}>
            {course.code} — {course.title}
          </div>
          <div className={styles.week}>Week {weekIndex + 1} · {entry.weekOf ?? "—"}</div>
        </div>

        <Badge tone="progress">{entry.currentGradePercent ?? "—"}%</Badge>
      </div>

      <div className={styles.grid}>
        <div className={styles.stat}>
          <div className={styles.label}>Current Grade</div>
          <div className={styles.value}>{entry.currentGradePercent ?? "—"}%</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Accumulated</div>
          <div className={styles.value}>{entry.accumulatedPercentPoints ?? "—"}%</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Used</div>
          <div className={styles.value}>{entry.usedPercentPoints ?? "—"}%</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Lost</div>
          <div className={styles.value}>{entry.lostPercentPoints ?? "—"}%</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Max Possible</div>
          <div className={styles.value}>{entry.maxPossiblePercent ?? "—"}%</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Can Meet Goal</div>
          <div className={styles.value}>
            <Badge tone={entry.canMeetGoal ? "success" : "danger"}>
              {entry.canMeetGoal ? "Yes" : "No"}
            </Badge>
          </div>
        </div>
      </div>

      <div className={styles.computed}>
        Computed at: {entry.computedAt ? entry.computedAt.replace("T", " ") : "—"}
      </div>
    </Card>
  );
}