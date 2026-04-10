const snapshotDates = [
  "2026-01-19",
  "2026-01-26",
  "2026-02-02",
  "2026-02-09",
  "2026-02-16",
  "2026-02-23",
  "2026-03-02",
  "2026-03-09",
  "2026-03-16",
];

function buildSnapshots(courseId, weeklyValues, startId) {
  return snapshotDates.map((weekOf, index) => ({
    progressId: startId + index,
    courseId,
    accumulatedPercentPoints: weeklyValues[index].accumulatedPercentPoints,
    usedPercentPoints: weeklyValues[index].usedPercentPoints,
    lostPercentPoints: weeklyValues[index].lostPercentPoints,
    maxPossiblePercent: weeklyValues[index].maxPossiblePercent,
    currentGradePercent: weeklyValues[index].currentGradePercent,
    canMeetGoal: weeklyValues[index].canMeetGoal,
    weekOf,
    computedAt: `${weekOf}T10:00:00`,
  }));
}

let progress = [
  ...buildSnapshots(
    1,
    [
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 12.3, usedPercentPoints: 15, lostPercentPoints: 2.7, maxPossiblePercent: 97.3, currentGradePercent: 82.0, canMeetGoal: true },
      { accumulatedPercentPoints: 20.1, usedPercentPoints: 25, lostPercentPoints: 4.9, maxPossiblePercent: 95.1, currentGradePercent: 80.4, canMeetGoal: true },
      { accumulatedPercentPoints: 28.1, usedPercentPoints: 35, lostPercentPoints: 6.9, maxPossiblePercent: 93.1, currentGradePercent: 80.29, canMeetGoal: true },
      { accumulatedPercentPoints: 28.1, usedPercentPoints: 35, lostPercentPoints: 6.9, maxPossiblePercent: 93.1, currentGradePercent: 80.29, canMeetGoal: true },
      { accumulatedPercentPoints: 28.1, usedPercentPoints: 35, lostPercentPoints: 6.9, maxPossiblePercent: 93.1, currentGradePercent: 80.29, canMeetGoal: true },
      { accumulatedPercentPoints: 28.1, usedPercentPoints: 35, lostPercentPoints: 6.9, maxPossiblePercent: 93.1, currentGradePercent: 80.29, canMeetGoal: true },
      { accumulatedPercentPoints: 28.1, usedPercentPoints: 35, lostPercentPoints: 6.9, maxPossiblePercent: 93.1, currentGradePercent: 80.29, canMeetGoal: true },
      { accumulatedPercentPoints: 28.1, usedPercentPoints: 35, lostPercentPoints: 6.9, maxPossiblePercent: 93.1, currentGradePercent: 80.29, canMeetGoal: true },
    ],
    1
  ),

  ...buildSnapshots(
    2,
    [
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 0, usedPercentPoints: 10, lostPercentPoints: 10, maxPossiblePercent: 90, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 0, usedPercentPoints: 20, lostPercentPoints: 20, maxPossiblePercent: 80, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 0, usedPercentPoints: 30, lostPercentPoints: 30, maxPossiblePercent: 70, currentGradePercent: 0, canMeetGoal: false },
      { accumulatedPercentPoints: 0, usedPercentPoints: 55, lostPercentPoints: 55, maxPossiblePercent: 45, currentGradePercent: 0, canMeetGoal: false },
      { accumulatedPercentPoints: 0, usedPercentPoints: 55, lostPercentPoints: 55, maxPossiblePercent: 45, currentGradePercent: 0, canMeetGoal: false },
      { accumulatedPercentPoints: 0, usedPercentPoints: 70, lostPercentPoints: 70, maxPossiblePercent: 30, currentGradePercent: 0, canMeetGoal: false },
      { accumulatedPercentPoints: 0, usedPercentPoints: 70, lostPercentPoints: 70, maxPossiblePercent: 30, currentGradePercent: 0, canMeetGoal: false },
      { accumulatedPercentPoints: 0, usedPercentPoints: 70, lostPercentPoints: 70, maxPossiblePercent: 30, currentGradePercent: 0, canMeetGoal: false },
    ],
    10
  ),

  ...buildSnapshots(
    3,
    [
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 7.2, usedPercentPoints: 10, lostPercentPoints: 2.8, maxPossiblePercent: 97.2, currentGradePercent: 72.0, canMeetGoal: true },
      { accumulatedPercentPoints: 14.6, usedPercentPoints: 20, lostPercentPoints: 5.4, maxPossiblePercent: 94.6, currentGradePercent: 73.0, canMeetGoal: true },
      { accumulatedPercentPoints: 24.8, usedPercentPoints: 35, lostPercentPoints: 10.2, maxPossiblePercent: 89.8, currentGradePercent: 70.86, canMeetGoal: true },
      { accumulatedPercentPoints: 24.8, usedPercentPoints: 35, lostPercentPoints: 10.2, maxPossiblePercent: 89.8, currentGradePercent: 70.86, canMeetGoal: true },
      { accumulatedPercentPoints: 24.8, usedPercentPoints: 35, lostPercentPoints: 10.2, maxPossiblePercent: 89.8, currentGradePercent: 70.86, canMeetGoal: true },
      { accumulatedPercentPoints: 24.8, usedPercentPoints: 35, lostPercentPoints: 10.2, maxPossiblePercent: 89.8, currentGradePercent: 70.86, canMeetGoal: true },
      { accumulatedPercentPoints: 24.8, usedPercentPoints: 35, lostPercentPoints: 10.2, maxPossiblePercent: 89.8, currentGradePercent: 70.86, canMeetGoal: true },
      { accumulatedPercentPoints: 24.8, usedPercentPoints: 35, lostPercentPoints: 10.2, maxPossiblePercent: 89.8, currentGradePercent: 70.86, canMeetGoal: true },
    ],
    19
  ),

  ...buildSnapshots(
    4,
    [
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 7.0, usedPercentPoints: 10, lostPercentPoints: 3.0, maxPossiblePercent: 97.0, currentGradePercent: 70.0, canMeetGoal: true },
      { accumulatedPercentPoints: 13.6, usedPercentPoints: 20, lostPercentPoints: 6.4, maxPossiblePercent: 93.6, currentGradePercent: 68.0, canMeetGoal: true },
      { accumulatedPercentPoints: 13.6, usedPercentPoints: 20, lostPercentPoints: 6.4, maxPossiblePercent: 93.6, currentGradePercent: 68.0, canMeetGoal: true },
      { accumulatedPercentPoints: 13.6, usedPercentPoints: 20, lostPercentPoints: 6.4, maxPossiblePercent: 93.6, currentGradePercent: 68.0, canMeetGoal: true },
      { accumulatedPercentPoints: 13.6, usedPercentPoints: 20, lostPercentPoints: 6.4, maxPossiblePercent: 93.6, currentGradePercent: 68.0, canMeetGoal: true },
      { accumulatedPercentPoints: 13.6, usedPercentPoints: 20, lostPercentPoints: 6.4, maxPossiblePercent: 93.6, currentGradePercent: 68.0, canMeetGoal: true },
      { accumulatedPercentPoints: 13.6, usedPercentPoints: 20, lostPercentPoints: 6.4, maxPossiblePercent: 93.6, currentGradePercent: 68.0, canMeetGoal: true },
      { accumulatedPercentPoints: 13.6, usedPercentPoints: 20, lostPercentPoints: 6.4, maxPossiblePercent: 93.6, currentGradePercent: 68.0, canMeetGoal: true },
    ],
    28
  ),

  ...buildSnapshots(
    5,
    [
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 6.08, usedPercentPoints: 8, lostPercentPoints: 1.92, maxPossiblePercent: 98.08, currentGradePercent: 76.0, canMeetGoal: true },
      { accumulatedPercentPoints: 15.8, usedPercentPoints: 20, lostPercentPoints: 4.2, maxPossiblePercent: 95.8, currentGradePercent: 79.0, canMeetGoal: true },
      { accumulatedPercentPoints: 23.2, usedPercentPoints: 30, lostPercentPoints: 6.8, maxPossiblePercent: 93.2, currentGradePercent: 77.33, canMeetGoal: true },
      { accumulatedPercentPoints: 23.2, usedPercentPoints: 30, lostPercentPoints: 6.8, maxPossiblePercent: 93.2, currentGradePercent: 77.33, canMeetGoal: true },
      { accumulatedPercentPoints: 23.2, usedPercentPoints: 30, lostPercentPoints: 6.8, maxPossiblePercent: 93.2, currentGradePercent: 77.33, canMeetGoal: true },
      { accumulatedPercentPoints: 23.2, usedPercentPoints: 30, lostPercentPoints: 6.8, maxPossiblePercent: 93.2, currentGradePercent: 77.33, canMeetGoal: true },
      { accumulatedPercentPoints: 23.2, usedPercentPoints: 30, lostPercentPoints: 6.8, maxPossiblePercent: 93.2, currentGradePercent: 77.33, canMeetGoal: true },
      { accumulatedPercentPoints: 23.2, usedPercentPoints: 30, lostPercentPoints: 6.8, maxPossiblePercent: 93.2, currentGradePercent: 77.33, canMeetGoal: true },
    ],
    37
  ),

  ...buildSnapshots(
    6,
    [
      { accumulatedPercentPoints: 9.2, usedPercentPoints: 10, lostPercentPoints: 0.8, maxPossiblePercent: 99.2, currentGradePercent: 92.0, canMeetGoal: true },
      { accumulatedPercentPoints: 22.4, usedPercentPoints: 25, lostPercentPoints: 2.6, maxPossiblePercent: 97.4, currentGradePercent: 89.6, canMeetGoal: true },
      { accumulatedPercentPoints: 31.4, usedPercentPoints: 35, lostPercentPoints: 3.6, maxPossiblePercent: 96.4, currentGradePercent: 89.71, canMeetGoal: true },
      { accumulatedPercentPoints: 40.8, usedPercentPoints: 45, lostPercentPoints: 4.2, maxPossiblePercent: 95.8, currentGradePercent: 90.67, canMeetGoal: true },
      { accumulatedPercentPoints: 40.8, usedPercentPoints: 45, lostPercentPoints: 4.2, maxPossiblePercent: 95.8, currentGradePercent: 90.67, canMeetGoal: true },
      { accumulatedPercentPoints: 58.2, usedPercentPoints: 65, lostPercentPoints: 6.8, maxPossiblePercent: 93.2, currentGradePercent: 89.54, canMeetGoal: true },
      { accumulatedPercentPoints: 58.2, usedPercentPoints: 65, lostPercentPoints: 6.8, maxPossiblePercent: 93.2, currentGradePercent: 89.54, canMeetGoal: true },
      { accumulatedPercentPoints: 90.05, usedPercentPoints: 100, lostPercentPoints: 9.95, maxPossiblePercent: 90.05, currentGradePercent: 90.05, canMeetGoal: true },
      { accumulatedPercentPoints: 90.05, usedPercentPoints: 100, lostPercentPoints: 9.95, maxPossiblePercent: 90.05, currentGradePercent: 90.05, canMeetGoal: true },
    ],
    46
  ),

  ...buildSnapshots(
    7,
    [
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
      { accumulatedPercentPoints: 0, usedPercentPoints: 0, lostPercentPoints: 0, maxPossiblePercent: 100, currentGradePercent: 0, canMeetGoal: true },
    ],
    55
  ),
];

function nextId() {
  return progress.length
    ? Math.max(...progress.map((p) => Number(p.progressId))) + 1
    : 1;
}

export async function getProgress() {
  return structuredClone(progress);
}

export async function createProgress(payload) {
  const newProgress = {
    courseId: null,
    accumulatedPercentPoints: 0,
    usedPercentPoints: 0,
    lostPercentPoints: 0,
    maxPossiblePercent: 0,
    currentGradePercent: 0,
    canMeetGoal: false,
    weekOf: null,
    computedAt: null,
    ...payload,
    progressId: nextId(),
  };

  progress = [...progress, newProgress];
  return structuredClone(newProgress);
}

export async function updateProgress(id, payload) {
  const numericId = Number(id);
  const existing = progress.find((p) => Number(p.progressId) === numericId);
  const updated = { ...existing, ...payload, progressId: numericId };

  progress = progress.map((p) =>
    Number(p.progressId) === numericId ? updated : p
  );

  return structuredClone(updated);
}

export async function deleteProgress(id) {
  const numericId = Number(id);
  progress = progress.filter((p) => Number(p.progressId) !== numericId);
  return true;
}