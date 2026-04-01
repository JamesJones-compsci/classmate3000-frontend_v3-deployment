import { useState } from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import { useTasks } from "../hooks/useTasks";
import TaskRow from "../components/TaskRow";
import TaskFilterBar from "../components/TaskFilterBar";
import styles from "./TasksPage.module.css";

export default function TasksPage() {
  const { tasks, loading, error } = useTasks();
  const [filter, setFilter] = useState("all");

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const week = new Date(today);
  week.setDate(today.getDate() + 7);

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const filteredTasks = sortedTasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "overdue") {
      return task.dueDate && new Date(task.dueDate) < today && !task.isCompleted;
    }
    if (filter === "today") {
      if (!task.dueDate) return false;
      const date = new Date(task.dueDate);
      return date >= today && date < new Date(today.getTime() + 86400000);
    }
    if (filter === "week") {
      if (!task.dueDate) return false;
      const date = new Date(task.dueDate);
      return date >= today && date < week;
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <SectionHeader title="Tasks" breadcrumb="Home > Tasks > All Tasks" />

      <div className={styles.body}>
        <TaskFilterBar filter={filter} onFilterChange={setFilter} />

        {loading && <EmptyState message="Loading tasks..." />}
        {!loading && error && <EmptyState message={error} />}
        {!loading && !error && filteredTasks.length === 0 && (
          <EmptyState message="No tasks match this filter." />
        )}

        {!loading && !error && filteredTasks.length > 0 && (
          <div className={styles.stack}>
            {filteredTasks.map((task) => (
              <TaskRow key={task.taskId} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}