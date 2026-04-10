let reminders = [
  // Task 1 - multiple reminders
  {
    id: "reminder-1",
    reminderId: 1,
    taskId: 1,
    message: "Start working on your capstone proposal.",
    scheduledAt: "2026-01-17T09:00:00",
    wasSent: true,
  },
  {
    id: "reminder-2",
    reminderId: 2,
    taskId: 1,
    message: "Capstone proposal due in 2 days.",
    scheduledAt: "2026-01-18T18:00:00",
    wasSent: true,
  },

  // Task 4 - one reminder
  {
    id: "reminder-3",
    reminderId: 3,
    taskId: 4,
    message: "Progress report is due this week.",
    scheduledAt: "2026-02-26T10:00:00",
    wasSent: true,
  },

  // Task 5 - multiple reminders
  {
    id: "reminder-4",
    reminderId: 4,
    taskId: 5,
    message: "Prototype review coming up next week.",
    scheduledAt: "2026-03-11T09:00:00",
    wasSent: true,
  },
  {
    id: "reminder-5",
    reminderId: 5,
    taskId: 5,
    message: "Prototype review due tomorrow.",
    scheduledAt: "2026-03-17T18:00:00",
    wasSent: true,
  },

  // Task 6 - one upcoming reminder
  {
    id: "reminder-6",
    reminderId: 6,
    taskId: 6,
    message: "Final capstone submission due this week.",
    scheduledAt: "2026-04-07T09:00:00",
    wasSent: false,
  },

  // Task 8 - one reminder
  {
    id: "reminder-7",
    reminderId: 7,
    taskId: 8,
    message: "Finish Lab 2 before the deadline.",
    scheduledAt: "2026-02-01T18:00:00",
    wasSent: true,
  },

  // Task 10 - multiple reminders
  {
    id: "reminder-8",
    reminderId: 8,
    taskId: 10,
    message: "Midterm is coming up soon.",
    scheduledAt: "2026-02-20T09:00:00",
    wasSent: true,
  },
  {
    id: "reminder-9",
    reminderId: 9,
    taskId: 10,
    message: "Study for the midterm tonight.",
    scheduledAt: "2026-02-23T19:00:00",
    wasSent: true,
  },

  // Task 12 - one reminder
  {
    id: "reminder-10",
    reminderId: 10,
    taskId: 12,
    message: "Final exam is approaching.",
    scheduledAt: "2026-04-12T09:00:00",
    wasSent: false,
  },

  // Task 14 - one reminder
  {
    id: "reminder-11",
    reminderId: 11,
    taskId: 14,
    message: "Complete the sprint backlog setup.",
    scheduledAt: "2026-02-01T17:00:00",
    wasSent: true,
  },

  // Task 16 - multiple reminders
  {
    id: "reminder-12",
    reminderId: 12,
    taskId: 16,
    message: "UI prototype should be started soon.",
    scheduledAt: "2026-02-25T10:00:00",
    wasSent: true,
  },
  {
    id: "reminder-13",
    reminderId: 13,
    taskId: 16,
    message: "UI prototype due tomorrow.",
    scheduledAt: "2026-03-01T18:00:00",
    wasSent: true,
  },

  // Task 18 - one upcoming reminder
  {
    id: "reminder-14",
    reminderId: 14,
    taskId: 18,
    message: "Final full stack project due this week.",
    scheduledAt: "2026-04-09T09:00:00",
    wasSent: false,
  },

  // Task 21 - one reminder
  {
    id: "reminder-15",
    reminderId: 15,
    taskId: 21,
    message: "Prepare your navigation flow demo.",
    scheduledAt: "2026-02-17T18:00:00",
    wasSent: true,
  },

  // Task 23 - one reminder
  {
    id: "reminder-16",
    reminderId: 16,
    taskId: 23,
    message: "Midterm practical is this week.",
    scheduledAt: "2026-03-10T09:00:00",
    wasSent: true,
  },

  // Task 24 - multiple reminders
  {
    id: "reminder-17",
    reminderId: 17,
    taskId: 24,
    message: "Final mobile app build due next week.",
    scheduledAt: "2026-04-01T09:00:00",
    wasSent: false,
  },
  {
    id: "reminder-18",
    reminderId: 18,
    taskId: 24,
    message: "Final mobile app build due tomorrow.",
    scheduledAt: "2026-04-07T18:00:00",
    wasSent: false,
  },

  // Task 28 - one reminder
  {
    id: "reminder-19",
    reminderId: 19,
    taskId: 28,
    message: "Midterm test is tomorrow.",
    scheduledAt: "2026-02-26T18:00:00",
    wasSent: true,
  },

  // Task 30 - one upcoming reminder
  {
    id: "reminder-20",
    reminderId: 20,
    taskId: 30,
    message: "Final database project due this week.",
    scheduledAt: "2026-04-09T09:00:00",
    wasSent: false,
  },

  // Task 31 - one reminder
  {
    id: "reminder-21",
    reminderId: 21,
    taskId: 31,
    message: "Complete the HTML/CSS review lab.",
    scheduledAt: "2026-01-16T18:00:00",
    wasSent: true,
  },

  // Task 35 - one reminder
  {
    id: "reminder-22",
    reminderId: 22,
    taskId: 35,
    message: "Midterm project deadline is approaching.",
    scheduledAt: "2026-03-03T09:00:00",
    wasSent: true,
  },

  // Task 36 - multiple reminders
  {
    id: "reminder-23",
    reminderId: 23,
    taskId: 36,
    message: "Final web app due in one week.",
    scheduledAt: "2026-04-02T09:00:00",
    wasSent: false,
  },
  {
    id: "reminder-24",
    reminderId: 24,
    taskId: 36,
    message: "Final web app due tomorrow.",
    scheduledAt: "2026-04-08T18:00:00",
    wasSent: false,
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
    id: `reminder-${nextId()}`,
    reminderId: nextId(),
    taskId: null,
    message: "",
    scheduledAt: null,
    wasSent: false,
    ...payload,
  };

  reminders = [...reminders, newReminder];
  return structuredClone(newReminder);
}

export async function updateReminder(id, payload) {
  const numericId = Number(id);
  const existing = reminders.find((r) => Number(r.reminderId) === numericId);
  const updated = {
    ...existing,
    ...payload,
    reminderId: numericId,
    id: existing?.id ?? `reminder-${numericId}`,
  };

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