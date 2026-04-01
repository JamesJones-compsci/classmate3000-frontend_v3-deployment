let progress = [
  {
    progressId: 1,
    courseId: 1,
    currentGradePercent: 78,
    accumulatedPercentPoints: 23,
    usedPercentPoints: 30,
    lostPercentPoints: 7,
    maxPossiblePercent: 93,
    canMeetGoal: true,
    weekOf: "2026-03-16",
    computedAt: "2026-03-16T10:00:00",
  },
  {
    progressId: 2,
    courseId: 1,
    currentGradePercent: 81,
    accumulatedPercentPoints: 28,
    usedPercentPoints: 35,
    lostPercentPoints: 7,
    maxPossiblePercent: 93,
    canMeetGoal: true,
    weekOf: "2026-03-23",
    computedAt: "2026-03-23T10:00:00",
  },
  {
    progressId: 3,
    courseId: 2,
    currentGradePercent: 74,
    accumulatedPercentPoints: 15,
    usedPercentPoints: 20,
    lostPercentPoints: 5,
    maxPossiblePercent: 95,
    canMeetGoal: true,
    weekOf: "2026-03-23",
    computedAt: "2026-03-23T10:00:00",
  },
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
    accumulatedPercentPoints: null,
    usedPercentPoints: null,
    lostPercentPoints: null,
    maxPossiblePercent: null,
    canMeetGoal: null,
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