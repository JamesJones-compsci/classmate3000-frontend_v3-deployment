let tasks = [
  {
    taskId: 1,
    courseId: 1,
    title: "Capstone proposal",
    type: "PROJECT",
    dueDate: "2026-04-05T17:00:00",
    weight: 15,
    bonus: false,
    isCompleted: false,
  },
  {
    taskId: 2,
    courseId: 2,
    title: "Lab 2",
    type: "LAB",
    dueDate: "2026-04-02T17:00:00",
    weight: 10,
    bonus: false,
    isCompleted: false,
  },
];

function nextId() {
  return tasks.length ? Math.max(...tasks.map((t) => Number(t.taskId))) + 1 : 1;
}

export async function getTasks() {
  return structuredClone(tasks);
}

export async function createTask(payload) {
  const newTask = {
    isCompleted: false,
    ...payload,
    taskId: nextId(),
  };
  tasks = [...tasks, newTask];
  return structuredClone(newTask);
}

export async function updateTask(id, payload) {
  const numericId = Number(id);
  const existing = tasks.find((t) => Number(t.taskId) === numericId);
  const updated = { ...existing, ...payload, taskId: numericId };

  tasks = tasks.map((t) =>
    Number(t.taskId) === numericId ? updated : t
  );

  return structuredClone(updated);
}

export async function deleteTask(id) {
  const numericId = Number(id);
  tasks = tasks.filter((t) => Number(t.taskId) !== numericId);
  return true;
}