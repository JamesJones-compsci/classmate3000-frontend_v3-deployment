import Card from "../../../components/ui/Card";
import styles from "./ProgressCard.module.css";

export default function ProgressCard({ entry }) {
  return (
    <Card className={styles.card}>
      <div className={styles.week}>Week of {entry.weekOf}</div>
      <div className={styles.grade}>{entry.currentGradePercent ?? "—"}%</div>
      <div className={styles.meta}>
        Lost: {entry.lostPercentPoints ?? "—"}%
      </div>
    </Card>
  );
}