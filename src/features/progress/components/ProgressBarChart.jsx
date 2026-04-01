import styles from "./ProgressBarChart.module.css";

export default function ProgressBarChart({ course, entries }) {
  const sorted = [...entries].sort((a, b) => new Date(a.weekOf) - new Date(b.weekOf));

  const data = sorted.map((entry, index) => ({
    label: `Week ${index + 1}`,
    accumulated:
      entry.accumulatedPercentPoints != null
        ? Number(entry.accumulatedPercentPoints)
        : Number(entry.currentGradePercent ?? 0),
    maxPossible: Number(entry.maxPossiblePercent ?? 0),
  }));

  if (!data.length) {
    return (
      <div className={styles.chartBox}>
        <div className={styles.title}>Progress Chart</div>
        <p className={styles.empty}>No chart data yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.chartBox}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Progress by Week</div>
          {course ? (
            <div className={styles.subtitle}>
              {course.code} — {course.title}
            </div>
          ) : null}
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.accumulated}`} />
            <span>Accumulated %</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.maxPossible}`} />
            <span>Max Possible %</span>
          </div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        {data.map((item) => (
          <div key={item.label} className={styles.group}>
            <div className={styles.bars}>
              <div className={styles.barWrap}>
                <div
                  className={`${styles.bar} ${styles.accumulated}`}
                  style={{ height: `${Math.max(item.accumulated, 0)}%` }}
                />
              </div>

              <div className={styles.barWrap}>
                <div
                  className={`${styles.bar} ${styles.maxPossible}`}
                  style={{ height: `${Math.max(item.maxPossible, 0)}%` }}
                />
              </div>
            </div>

            <div className={styles.values}>
              <span>{item.accumulated}%</span>
              <span>{item.maxPossible}%</span>
            </div>

            <div className={styles.label}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}