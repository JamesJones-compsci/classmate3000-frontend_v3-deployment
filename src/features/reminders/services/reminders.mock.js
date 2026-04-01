let reminders = [
  {
    reminderId: 1,
    taskId: 1,
    message: "Proposal deadline approaching",
    scheduledAt: "2026-04-04T09:00:00",
    wasSent: false,
  },
  {
    reminderId: 2,
    taskId: 2,
    message: "Finish the lab write-up",
    scheduledAt: "2026-04-01T18:00:00",
    wasSent: true,
  },
];

function nextId() {
  return reminders.length
    ? Math.max(...reminders.map((r) => Number(r.reminderId))) + 1
    : 1;
}

export async function getReminders() {
  return structuredClone(reminders);
}

export async function createReminder(payload) {
  const newReminder = {
    ...payload,
    reminderId: nextId(),
  };
  reminders = [...reminders, newReminder];
  return structuredClone(newReminder);
}

export async function updateReminder(id, payload) {
  const numericId = Number(id);
  const existing = reminders.find((r) => Number(r.reminderId) === numericId);
  const updated = { ...existing, ...payload, reminderId: numericId };

  reminders = reminders.map((r) =>
    Number(r.reminderId) === numericId ? updated : r
  );

  return structuredClone(updated);
}

export async function deleteReminder(id) {
  const numericId = Number(id);
  reminders = reminders.filter((r) => Number(r.reminderId) !== numericId);
  return true;
}