import { useEffect, useState } from "react";
import { tasksService } from "../services/tasks.service";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadTasks() {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksService.getTasks();
      setTasks(data);
    } catch {
      setError("Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }

  async function addTask(payload) {
    const created = await tasksService.createTask(payload);
    setTasks((prev) => [...prev, created]);
    return created;
  }

  async function editTask(id, payload) {
    const updated = await tasksService.updateTask(id, payload);
    setTasks((prev) =>
      prev.map((task) =>
        Number(task.taskId) === Number(id) ? updated : task
      )
    );
    return updated;
  }

  async function updateTask(taskId, updates) {
    setTasks((prev) =>
      prev.map((t) =>
        t.taskId === taskId ? { ...t, ...updates } : t
      )
    );
  }

  async function removeTask(id) {
    await tasksService.deleteTask(id);
    setTasks((prev) =>
      prev.filter((task) => Number(task.taskId) !== Number(id))
    );
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    addTask,
    editTask,
    updateTask,
    removeTask,
  };
}