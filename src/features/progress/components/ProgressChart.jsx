import styles from "./ProgressChart.module.css";

function formatWeekLabel(weekOf) {
  if (!weekOf) return "—";
  const date = new Date(`${weekOf}T00:00:00`);
  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  });
}

function groupByCourse(entries) {
  const map = new Map();

  for (const entry of entries) {
    const key = String(entry.courseId ?? "unknown");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(entry);
  }

  for (const list of map.values()) {
    list.sort((a, b) => new Date(a.weekOf) - new Date(b.weekOf));
  }

  return Array.from(map.entries()).map(([courseId, values]) => ({
    courseId,
    values,
  }));
}

function buildLinePoints(values, width, height, padding) {
  if (!values.length) return "";

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  return values
    .map((entry, index) => {
      const x =
        values.length === 1
          ? width / 2
          : padding + (index / (values.length - 1)) * innerWidth;

      const grade = Number(entry.currentGradePercent ?? 0);
      const y = padding + ((100 - grade) / 100) * innerHeight;

      return `${x},${y}`;
    })
    .join(" ");
}

export default function ProgressChart({ entries }) {
  const grouped = groupByCourse(entries);

  const width = 760;
  const height = 260;
  const padding = 28;

  if (!entries?.length) {
    return (
      <div className={styles.chartBox}>
        <div className={styles.title}>Weekly Progress</div>
        <p className={styles.empty}>No progress data yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.chartBox}>
      <div className={styles.header}>
        <div className={styles.title}>Weekly Progress</div>
        <div className={styles.legend}>
          {grouped.map((group, index) => (
            <div key={group.courseId} className={styles.legendItem}>
              <span
                className={`${styles.legendSwatch} ${styles[`series${(index % 4) + 1}`]}`}
              />
              <span>Course {group.courseId}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.svgWrap}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={styles.svg}
          role="img"
          aria-label="Weekly progress line chart"
        >
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = padding + ((100 - tick) / 100) * (height - padding * 2);

            return (
              <g key={tick}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  className={styles.gridLine}
                />
                <text x={8} y={y + 4} className={styles.axisLabel}>
                  {tick}%
                </text>
              </g>
            );
          })}

          {grouped.map((group, index) => {
            const points = buildLinePoints(group.values, width, height, padding);
            const seriesClass = styles[`series${(index % 4) + 1}`];

            return (
              <g key={group.courseId}>
                <polyline
                  fill="none"
                  points={points}
                  className={`${styles.line} ${seriesClass}`}
                />
                {group.values.map((entry, pointIndex) => {
                  const x =
                    group.values.length === 1
                      ? width / 2
                      : padding +
                        (pointIndex / (group.values.length - 1)) *
                          (width - padding * 2);

                  const grade = Number(entry.currentGradePercent ?? 0);
                  const y =
                    padding + ((100 - grade) / 100) * (height - padding * 2);

                  return (
                    <g key={entry.progressId}>
                      <circle cx={x} cy={y} r="4" className={seriesClass} />
                      <title>
                        {`Course ${group.courseId} · ${formatWeekLabel(entry.weekOf)} · ${grade}%`}
                      </title>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.xLabels}>
        {grouped[0]?.values?.map((entry) => (
          <span key={entry.progressId} className={styles.xLabel}>
            {formatWeekLabel(entry.weekOf)}
          </span>
        ))}
      </div>
    </div>
  );
}