import styles from "./ProgressChart.module.css";

export default function ProgressChart({ entries }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.weekOf) - new Date(b.weekOf)
  );

  return (
    <div className={styles.chartBox}>
      <div className={styles.title}>Weekly Progress</div>

      <div className={styles.list}>
        {sorted.map((entry) => (
          <div key={entry.progressId} className={styles.row}>
            <span>{entry.weekOf}</span>
            <strong>{entry.currentGradePercent ?? "—"}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}