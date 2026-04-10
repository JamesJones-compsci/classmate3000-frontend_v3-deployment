import styles from "./ProgressBarChart.module.css";

function clampPercent(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Number(value)));
}

function formatSnapshotDate(dateValue) {
  if (!dateValue) return "—";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function ProgressBarChart({ course, entries }) {
  const sorted = [...entries].sort((a, b) => new Date(a.weekOf) - new Date(b.weekOf));

  const data = sorted.slice(1).map((entry) => {
    const accumulated = Number(entry.accumulatedPercentPoints ?? 0);
    const used = Number(entry.usedPercentPoints ?? 0);
    const lost = Number(entry.lostPercentPoints ?? 0);

    const achievedPercent =
      used > 0
        ? clampPercent((accumulated / used) * 100)
        : clampPercent(Number(entry.currentGradePercent ?? 0));

    const possibleFinalPercent = clampPercent(100 - lost);

    return {
      dateLabel: formatSnapshotDate(entry.weekOf),
      achievedPercent: Number(achievedPercent.toFixed(1)),
      possibleFinalPercent: Number(possibleFinalPercent.toFixed(1)),
    };
  });

  if (sorted.length <= 1) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.titleBlock}>
          <div className={styles.title}>Progress by Week</div>
          {course ? (
            <div className={styles.subtitle}>
              {course.code} — {course.title}
            </div>
          ) : null}
        </div>

        <p className={styles.empty}>No chart data yet.</p>
      </div>
    );
  }

  const yTicks = [0, 20, 40, 60, 80, 100];
  const goalGrade = clampPercent(Number(course?.gradeGoal ?? 0));

  return (
    <div className={styles.chartCard}>
      <div className={styles.titleBlock}>
        <div className={styles.title}>Progress by Week</div>
        {course ? (
          <div className={styles.subtitle}>
            {course.code} — {course.title}
          </div>
        ) : null}
      </div>

      <div className={styles.chartWrap}>
        <div className={styles.chartMain}>
          <div className={styles.yAxisLabel}>Percent</div>

          <div className={styles.yAxis}>
            {yTicks.map((tick) => (
              <div
                key={tick}
                className={styles.yTick}
                style={{ bottom: `${tick}%` }}
              >
                {tick}
              </div>
            ))}

            {goalGrade > 0 ? (
              <div
                className={styles.goalTick}
                style={{ bottom: `${goalGrade}%` }}
              >
                {goalGrade}
              </div>
            ) : null}
          </div>

          <div className={styles.plotArea}>
            {yTicks.map((tick) => {
              const lineBottom = tick === 100 ? "99.6%" : `${tick}%`;

              return (
                <div
                  key={tick}
                  className={styles.gridLine}
                  style={{ bottom: lineBottom }}
                />
              );
            })}

            {goalGrade > 0 ? (
              <div
                className={styles.goalLine}
                style={{ bottom: `${goalGrade}%` }}
              />
            ) : null}

            <div className={styles.barGroups}>
              {data.map((item) => (
                <div key={item.dateLabel} className={styles.group}>
                  <div className={styles.barPair}>
                    <div className={styles.barColumn}>
                      <div className={styles.barWrapper}>
                        <div
                          className={`${styles.bar} ${styles.achievedBar}`}
                          style={{ height: `${item.achievedPercent}%` }}
                        />
                        <div className={`${styles.barValue} ${styles.achievedValue}`}>
                          {item.achievedPercent}%
                        </div>
                      </div>
                    </div>

                    <div className={styles.barColumn}>
                      <div className={styles.barWrapper}>
                        <div
                          className={`${styles.bar} ${styles.possibleBar}`}
                          style={{ height: `${item.possibleFinalPercent}%` }}
                        />
                        <div className={`${styles.barValue} ${styles.possibleValue}`}>
                          {item.possibleFinalPercent}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.dateRow}>
          <div className={styles.dateSpacer} />
          <div className={styles.dateLabels}>
            {data.map((item) => (
              <div key={item.dateLabel} className={styles.dateLabel}>
                {item.dateLabel}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.xAxisRow}>
          <div className={styles.xAxisSpacer} />
          <div className={styles.xAxisLabel}>Weekly Progress Snapshot</div>
        </div>

        <div className={styles.legendWrap}>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={`${styles.swatch} ${styles.achievedSwatch}`} />
              <span>Currently Achieved %</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.swatch} ${styles.possibleSwatch}`} />
              <span>Possible Final %</span>
            </div>
            {goalGrade > 0 ? (
              <div className={styles.legendItem}>
                <span className={`${styles.lineSwatch} ${styles.goalSwatch}`} />
                <span>Goal Grade</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}