import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import styles from "./ProgressCard.module.css";

export default function ProgressCard({ entry }) {
  return (
    <Card className={styles.card}>
      <div className={styles.top}>
        <div className={styles.week}>Week of {entry.weekOf}</div>
        <Badge tone="progress">{entry.currentGradePercent ?? "—"}%</Badge>
      </div>

      <div className={styles.meta}>Lost: {entry.lostPercentPoints ?? "—"}%</div>
      <div className={styles.meta}>Max possible: {entry.maxPossiblePercent ?? "—"}%</div>
    </Card>
  );
}